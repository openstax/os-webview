import React from 'react';
import type {TableBlockConfig, TableCellConfig} from '@openstax/flex-page-renderer/blocks/TableBlock.config';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import useUserContext from '~/contexts/user';
import {ResourceData} from '~/pages/details/common/resource-box/resource-box-utils';

export type {TableBlockConfig, TableCellConfig};

// The CMS emits this marker snake_case (book_slug/book_id/resource_type);
// usePageData camelCases every key of a page payload before a block ever
// sees it, so these are the names that actually arrive.
export type ResourceRefValue = {
    bookSlug: string;
    bookId: number;
    heading: string;
    resourceType: string;
    // Newer markers carry the resources-API row's own id for an exact match;
    // cached table JSON up to 30 days old predates this field, so it's
    // optional and the heading match below stays the fallback.
    resourceId?: number;
};

type ResourceRefConfigEntry = {type: 'resource_ref'; value: ResourceRefValue};

export type ResourceRefLocation = {
    rowIndex: number;
    cellIndex: number;
    ref: ResourceRefValue;
};

function getResourceRef(cell: TableCellConfig): ResourceRefValue | null {
    const cta = cell.cta?.[0];

    if (!cta) {
        return null;
    }

    // cta.config is typed narrowly by the renderer (its own `style`/
    // `custom_color` CTA config options) - it has no idea about our
    // resource_ref marker convention, but the CMS adds one to the same
    // array at runtime regardless.
    const entries = cta.config as unknown as Array<ResourceRefConfigEntry | {type: string}>;
    const entry = entries.find((c): c is ResourceRefConfigEntry => c.type === 'resource_ref');

    return entry ? entry.value : null;
}

// Scans every cell for a resource_ref marker. Cells without one (the vast
// majority of tables) are never touched.
export function findResourceRefs(data: TableBlockConfig): ResourceRefLocation[] {
    const refs: ResourceRefLocation[] = [];

    data.value.rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, cellIndex) => {
            const ref = getResourceRef(cell);

            if (ref) {
                refs.push({rowIndex, cellIndex, ref});
            }
        });
    });

    return refs;
}

// Casefold, trim, collapse whitespace, drop apostrophes/punctuation - CMS
// headings and the resources API's headings can differ in punctuation only
// (e.g. "Instructor's Manual" vs "Instructors Manual").
export function normalizeHeading(heading: string): string {
    return heading
        .normalize('NFKD')
        .replace(/[‘’']/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim()
        .toLowerCase();
}

export type BookResourcesPayload = {
    bookFacultyResources?: ResourceData[];
    bookStudentResources?: ResourceData[];
};

function isStudentRef(ref: ResourceRefValue): boolean {
    return ref.resourceType.toLowerCase() === 'student';
}

// Instructor resources carry their heading nested under `.resource.heading`;
// student resources carry it as a flat `.resourceHeading` (see the private
// resourceBoxModel in student-resource-tab.tsx, which reads the same field -
// there's no single shared field name to reuse here).
function headingOf(resource: ResourceData, isStudent: boolean): string | undefined {
    return isStudent ? resource.resourceHeading : resource.resource?.heading;
}

function findMatchingResource(
    resources: ResourceData[] | undefined,
    ref: ResourceRefValue,
    isStudent: boolean
): ResourceData | undefined {
    if (!resources) {
        return undefined;
    }

    // Id match first: the heading join drifts silently when the CMS and
    // resources-API headings diverge, so an id on the marker wins outright.
    // No id (older cached markers) or no row with that id falls through to
    // the heading match, which must keep working either way.
    if (ref.resourceId !== undefined) {
        const byId = resources.find((r) => r.id === ref.resourceId);

        if (byId) {
            return byId;
        }
    }

    const target = normalizeHeading(ref.heading);

    return resources.find((r) => {
        const candidate = headingOf(r, isStudent);

        return candidate && normalizeHeading(candidate) === target;
    });
}

// Module-level so every table on a page - and every concurrent mount of the
// same book - shares one in-flight request instead of one per table (a page
// like /k12-math with 18 marked tables over 12 distinct books was issuing
// ~50 requests). Keyed on slug+verified since both affect the response.
// Holds the *promise*, not the resolved payload, so two callers racing
// before the first fetch settles still collapse onto one request.
const resourcesCache = new Map<string, Promise<BookResourcesPayload | undefined>>();
const unmatchedTelemetrySent = new Set<string>();

export function resetResourcesCacheForTesting(): void {
    resourcesCache.clear();
    unmatchedTelemetrySent.clear();
}

function fetchBookResources(
    slug: string,
    isVerified: boolean | undefined
): Promise<BookResourcesPayload | undefined> {
    const cacheKey = `${slug}|${isVerified}`;
    const cached = resourcesCache.get(cacheKey);

    if (cached) {
        return cached;
    }

    const title = slug.replace('books/', '');
    const url = `books/resources/?slug=${title}&x=${isVerified ? 'x' : 'y'}`;
    const promise = fetchFromCMS(url).then((raw) => {
        if (raw?.error) {
            // Don't cache a failure forever - a later mount should retry
            // rather than being stuck with `undefined` for the page's life.
            resourcesCache.delete(cacheKey);
            return undefined;
        }
        return camelCaseKeys(raw) as object as BookResourcesPayload;
    });

    resourcesCache.set(cacheKey, promise);
    return promise;
}

// Fetches `books/resources/` for every distinct book slug referenced by the
// table in a single effect (Promise.all), keyed on the sorted, de-duped slug
// set plus the verified flag so it refetches exactly when either changes.
// This can't be `useResources` called per-slug: a table can reference several
// books, and calling a hook inside `.map()`/a loop over a dynamic list breaks
// the rules of hooks (the number/identity of hook calls must stay constant
// across renders). This hook calls `fetchFromCMS` directly instead - the same
// call `useResources` makes internally - so behavior (URL shape, camelCasing,
// the `x=` verified param) stays identical without invoking that hook. The
// per-slug request itself is shared across every table via `resourcesCache`.
export function useResourcesBySlug(
    slugs: string[],
    isVerified: boolean | undefined
): Record<string, BookResourcesPayload> {
    const key = Array.from(new Set(slugs)).sort().join('|');
    const [resourcesBySlug, setResourcesBySlug] = React.useState<Record<string, BookResourcesPayload>>({});

    React.useEffect(() => {
        const distinctSlugs = key ? key.split('|') : [];

        // Nothing to fetch (no marked cells): leave the default `{}` alone
        // rather than setting an equivalent-but-new object, which would
        // trigger a pointless extra render on the no-op path.
        if (!distinctSlugs.length) {
            return undefined;
        }

        let cancelled = false;

        Promise.all(
            distinctSlugs.map((slug) => fetchBookResources(slug, isVerified)
                .then((payload) => [slug, payload] as const))
        ).then((entries) => {
            if (cancelled) {
                return;
            }

            const next: Record<string, BookResourcesPayload> = {};

            entries.forEach(([slug, payload]) => {
                if (payload) {
                    next[slug] = payload;
                }
            });
            setResourcesBySlug(next);
        });

        return () => {
            cancelled = true;
        };
    }, [key, isVerified]);

    return resourcesBySlug;
}

export type ResourceRefResolution = ResourceRefLocation & {
    status: 'loading' | 'unmatched' | 'resolved';
    resource?: ResourceData;
    bookId?: number;
};

function resolveOne(
    location: ResourceRefLocation,
    payload: BookResourcesPayload | undefined
): ResourceRefResolution {
    if (!payload) {
        return {...location, status: 'loading'};
    }

    const isStudent = isStudentRef(location.ref);
    const resource = findMatchingResource(
        isStudent ? payload.bookStudentResources : payload.bookFacultyResources,
        location.ref,
        isStudent
    );

    return resource
        ? {...location, status: 'resolved', resource, bookId: location.ref.bookId}
        : {...location, status: 'unmatched'};
}

function unmatchedTelemetryKey(ref: ResourceRefValue): string {
    return `${ref.bookSlug}|${normalizeHeading(ref.heading)}|${ref.resourceType.toLowerCase()}`;
}

// An unmatched marker still renders the CMS's own fallback link, so it fails
// silently by design - both recent table bugs (a bad heading join, a stale
// slug) were invisible until someone happened to click through. This is the
// only signal that a marker went unresolved in production.
function reportUnmatched(ref: ResourceRefValue): void {
    const key = unmatchedTelemetryKey(ref);

    if (unmatchedTelemetrySent.has(key)) {
        return;
    }
    unmatchedTelemetrySent.add(key);

    window.dataLayer ||= [];
    window.dataLayer.push({
        event: 'resourceRefUnmatched',
        bookSlug: ref.bookSlug,
        heading: ref.heading,
        resourceType: ref.resourceType
    });
}

// The multi-slug resolution hook: given every resource_ref marker found in a
// table (see findResourceRefs), fetches the distinct referenced books'
// resources once each and returns each marker's resolved state - `loading`
// (still fetching), `unmatched` (loaded, no resource with that heading - the
// CMS's own fallback link should stay untouched), or `resolved` (a real
// ResourceData + the marker's own bookId a cell renderer can build a model
// from). Deliberately doesn't compute permissions/URLs itself - that's
// TableResourceCell's job, via the same instructorResourceBoxPermissions/
// studentResourceBoxPermissions + LeftContent the book detail page uses, so
// Give-dialog/download-tracking behavior isn't duplicated here.
export function useResourceRefResolutions(refs: ResourceRefLocation[]): ResourceRefResolution[] {
    const slugs = React.useMemo(
        () => Array.from(new Set(refs.map(({ref}) => ref.bookSlug))),
        [refs]
    );
    const {isVerified} = useUserContext();
    const resourcesBySlug = useResourcesBySlug(slugs, isVerified);
    const resolutions = React.useMemo(
        () => refs.map((location) => resolveOne(location, resourcesBySlug[location.ref.bookSlug])),
        [refs, resourcesBySlug]
    );

    // An effect, not inline in the memo above: reporting is a side effect
    // (dataLayer.push), and the memo body needs to stay a pure derivation.
    React.useEffect(() => {
        resolutions
            .filter((resolution) => resolution.status === 'unmatched')
            .forEach((resolution) => reportUnmatched(resolution.ref));
    }, [resolutions]);

    return resolutions;
}

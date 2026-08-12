import React from 'react';
import type {TableBlockConfig, TableCellConfig} from '@openstax/flex-page-renderer/blocks/TableBlock.config';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import useUserContext from '~/contexts/user';
import {ResourceData} from '~/pages/details/common/resource-box/resource-box-utils';

export type {TableBlockConfig, TableCellConfig};

export type ResourceRefValue = {
    book_slug: string;
    book_id: number;
    heading: string;
    resource_type: string;
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
    return ref.resource_type.toLowerCase() === 'student';
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
    heading: string,
    isStudent: boolean
): ResourceData | undefined {
    if (!resources) {
        return undefined;
    }

    const target = normalizeHeading(heading);

    return resources.find((r) => {
        const candidate = headingOf(r, isStudent);

        return candidate && normalizeHeading(candidate) === target;
    });
}

// Fetches `books/resources/` for every distinct book slug referenced by the
// table in a single effect (Promise.all), keyed on the sorted, de-duped slug
// set plus the verified flag so it refetches exactly when either changes.
// This can't be `useResources` called per-slug: a table can reference several
// books, and calling a hook inside `.map()`/a loop over a dynamic list breaks
// the rules of hooks (the number/identity of hook calls must stay constant
// across renders). This hook calls `fetchFromCMS` directly instead - the same
// call `useResources` makes internally - so behavior (URL shape, camelCasing,
// the `x=` verified param) stays identical without invoking that hook.
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
            distinctSlugs.map((slug) => {
                const title = slug.replace('books/', '');
                const url = `books/resources/?slug=${title}&x=${isVerified ? 'x' : 'y'}`;

                return fetchFromCMS(url).then((raw) => {
                    const payload = raw?.error
                        ? undefined
                        : (camelCaseKeys(raw) as object as BookResourcesPayload);

                    return [slug, payload] as const;
                });
            })
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
        location.ref.heading,
        isStudent
    );

    return resource
        ? {...location, status: 'resolved', resource, bookId: location.ref.book_id}
        : {...location, status: 'unmatched'};
}

// The multi-slug resolution hook: given every resource_ref marker found in a
// table (see findResourceRefs), fetches the distinct referenced books'
// resources once each and returns each marker's resolved state - `loading`
// (still fetching), `unmatched` (loaded, no resource with that heading - the
// CMS's own fallback link should stay untouched), or `resolved` (a real
// ResourceData + the marker's own book_id a cell renderer can build a model
// from). Deliberately doesn't compute permissions/URLs itself - that's
// TableResourceCell's job, via the same instructorResourceBoxPermissions/
// studentResourceBoxPermissions + LeftContent the book detail page uses, so
// Give-dialog/download-tracking behavior isn't duplicated here.
export function useResourceRefResolutions(refs: ResourceRefLocation[]): ResourceRefResolution[] {
    const slugs = React.useMemo(
        () => Array.from(new Set(refs.map(({ref}) => ref.book_slug))),
        [refs]
    );
    const {isVerified} = useUserContext();
    const resourcesBySlug = useResourcesBySlug(slugs, isVerified);

    return React.useMemo(
        () => refs.map((location) => resolveOne(location, resourcesBySlug[location.ref.book_slug])),
        [refs, resourcesBySlug]
    );
}

import React from 'react';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import type {UserStatus} from '~/contexts/user';
import {
    instructorResourceBoxPermissions,
    studentResourceBoxPermissions,
    ResourceData
} from '~/pages/details/common/resource-box/resource-box-utils';

// The literal search string `resourceBoxModel` (resource-box-utils.tsx) passes
// to instructorResourceBoxPermissions for the book detail page's own resource
// boxes. Reusing it keeps our login/faculty-access return URL built the exact
// same way (it's what produces the `?Instructor%20resources` suffix the CMS's
// own fallback link already uses for this marker — see the flex-draft-save
// contract for the `resource_ref` cta config).
const INSTRUCTOR_RESOURCES_SEARCH = 'Instructor resources';

// --- Table block data shapes -----------------------------------------------
//
// @openstax/flex-page-renderer doesn't export `blocks.table` yet in the
// version currently pinned by this app (the table block + this app's version
// bump are separate, coordinated changes - see block-map.ts). These types
// mirror the real TableBlock/CTABlock config shape (flex-pages
// packages/flex-page-renderer/src/blocks/TableBlock.config.ts and
// CTABlock.config.ts) so this file keeps working unchanged once that bump
// lands.

export type ResourceRefValue = {
    book_slug: string;
    heading: string;
    resource_type: string;
};

type CTAConfigEntry =
    | {type: 'resource_ref'; value: ResourceRefValue}
    | {type: string; value?: unknown};

export type CTALinkFields = {
    text: string;
    aria_label?: string;
    target: {
        type: string;
        value: string;
        params?: Record<string, string>;
    };
    config: CTAConfigEntry[];
};

export type TableCellConfig = {
    content?: string;
    cta?: CTALinkFields[];
};

export type TableRowConfig = {
    cells: TableCellConfig[];
};

export type TableBlockConfig = {
    id: string;
    type: 'table';
    value: {
        caption?: string;
        columns: Array<{header: string; type?: string}>;
        rows: TableRowConfig[];
        config: Array<{type: string; id?: string; value: string}>;
    };
};

export type ResourceRefLocation = {
    rowIndex: number;
    cellIndex: number;
    ref: ResourceRefValue;
};

function getResourceRef(cell: TableCellConfig): ResourceRefValue | null {
    const cta = cell.cta?.[0];
    const entry = cta?.config.find(
        (c): c is {type: 'resource_ref'; value: ResourceRefValue} => c.type === 'resource_ref'
    );

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

function findMatchingResource(
    resources: ResourceData[] | undefined,
    heading: string
): ResourceData | undefined {
    if (!resources) {
        return undefined;
    }

    const target = normalizeHeading(heading);

    return resources.find(
        (r) => r.resource?.heading && normalizeHeading(r.resource.heading) === target
    );
}

export type CellResolution =
    | {state: 'unlocked'; url: string; text: string; external: boolean}
    | {state: 'locked'; url: string};

type ResourceBoxPermissions = {iconType: string; link?: {text: string; url: string}};

// resourceBoxPermissions (resource-box-utils.tsx) builds its return value from
// a lookup table keyed by status, each branch with a different shape
// (unlocked/locked include `link`, pending doesn't); TS collapses that
// indexed access down to the narrowest common shape (`{iconType}`) rather
// than the true union, so the real `link` property isn't visible on the
// inferred return type. resource-boxes.tsx works around the same gap with its
// own `ResourceModel` override; do the same here rather than touching code
// under details/.
function getPermissions(
    resource: ResourceData,
    isStudent: boolean,
    userStatus: UserStatus
): ResourceBoxPermissions {
    return (isStudent
        ? studentResourceBoxPermissions(resource, userStatus)
        : instructorResourceBoxPermissions(resource, userStatus, INSTRUCTOR_RESOURCES_SEARCH)
    ) as ResourceBoxPermissions;
}

// Resolves one resource_ref to a real link (verified instructor/student), a
// login/faculty-access link (everyone else with an actionable next step), or
// `null`/`undefined` when the CMS fallback should be left exactly as-is:
// `undefined` means "still loading" (no payload for this slug yet), `null`
// means "loaded, but nothing actionable" (no matching resource, or a pending-
// verification state with no link at all to offer).
export function resolveCellLink(
    ref: ResourceRefValue,
    payload: BookResourcesPayload | undefined,
    userStatus: UserStatus
): CellResolution | null | undefined {
    if (!payload) {
        return undefined;
    }

    const isStudent = ref.resource_type.toLowerCase() === 'student';
    const resource = findMatchingResource(
        isStudent ? payload.bookStudentResources : payload.bookFacultyResources,
        ref.heading
    );

    if (!resource) {
        return null;
    }

    const permissions = getPermissions(resource, isStudent, userStatus);

    if (!permissions.link) {
        return null;
    }

    return permissions.iconType === 'lock'
        ? {state: 'locked', url: permissions.link.url}
        : {
            state: 'unlocked',
            url: permissions.link.url,
            text: permissions.link.text,
            external: permissions.iconType === 'external-link-alt'
        };
}

function patchCell(cell: TableCellConfig, resolution: CellResolution, loginToUnlockText: string): TableCellConfig {
    // A ref is only ever produced for a cell whose cta[0] carries a
    // resource_ref (see getResourceRef), so this cell is guaranteed to have
    // one - non-null by construction rather than by a runtime check.
    const originalCta = cell.cta![0];

    const patchedCta: CTALinkFields = resolution.state === 'unlocked'
        ? {
            ...originalCta,
            text: resolution.text,
            target: {type: resolution.external ? 'external' : 'internal', value: resolution.url}
        }
        : {
            ...originalCta,
            text: loginToUnlockText,
            target: {type: 'internal', value: resolution.url}
        };

    return {...cell, cta: [patchedCta]};
}

export type PatchContext = {
    resourcesBySlug: Record<string, BookResourcesPayload>;
    userStatus: UserStatus;
    loginToUnlockText: string;
};

// Produces a patched copy of `data` with resolved cells rewritten - never
// mutates the input. Rows/cells with nothing to patch are returned by
// reference unchanged.
export function patchTableData(
    data: TableBlockConfig,
    refs: ResourceRefLocation[],
    context: PatchContext
): TableBlockConfig {
    const patchesByRow = new Map<number, Map<number, TableCellConfig>>();

    refs.forEach(({rowIndex, cellIndex, ref}) => {
        const resolution = resolveCellLink(ref, context.resourcesBySlug[ref.book_slug], context.userStatus);

        if (!resolution) {
            return;
        }

        const original = data.value.rows[rowIndex].cells[cellIndex];
        const patchedCell = patchCell(original, resolution, context.loginToUnlockText);

        if (!patchesByRow.has(rowIndex)) {
            patchesByRow.set(rowIndex, new Map());
        }
        patchesByRow.get(rowIndex)?.set(cellIndex, patchedCell);
    });

    if (!patchesByRow.size) {
        return data;
    }

    return {
        ...data,
        value: {
            ...data.value,
            rows: data.value.rows.map((row, rowIndex) => {
                const rowPatches = patchesByRow.get(rowIndex);

                if (!rowPatches) {
                    return row;
                }

                return {
                    ...row,
                    cells: row.cells.map((cell, cellIndex) => rowPatches.get(cellIndex) ?? cell)
                };
            })
        }
    };
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

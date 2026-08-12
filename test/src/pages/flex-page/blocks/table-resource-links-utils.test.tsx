import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import type {CTALinkFields} from '@openstax/flex-page-renderer/blocks/CTABlock.config';
import {
    findResourceRefs,
    normalizeHeading,
    useResourceRefResolutions,
    type TableBlockConfig,
    type TableCellConfig
} from '~/pages/flex-page/blocks/table-resource-links-utils';

const mockUseUserContext = jest.fn();

jest.mock('~/contexts/user', () => ({
    ...jest.requireActual('~/contexts/user'),
    __esModule: true,
    default: () => mockUseUserContext()
}));

const mockFetchFromCMS = jest.fn();

jest.mock('~/helpers/page-data-utils', () => ({
    ...jest.requireActual('~/helpers/page-data-utils'),
    fetchFromCMS: (...args: [string]) => mockFetchFromCMS(...args)
}));

// The CMS/resources-API fixtures below are all snake_case (matching the real
// wire format the app camelCases at runtime).
/* eslint-disable camelcase */

// The renderer's own CTALinkFields.config is a strict style/custom_color
// union - it has no idea about our resource_ref marker, so `config` is
// loosened here rather than on the real type.
type CtaOverrides = Partial<Omit<CTALinkFields, 'config'>> & {config?: unknown[]};

function resourceRefCta(overrides: CtaOverrides = {}): CTALinkFields {
    return {
        text: 'View on book page',
        aria_label: '',
        target: {value: '/details/books/biology-2e?Instructor%20resources', type: 'internal'},
        config: [
            {
                type: 'resource_ref',
                value: {
                    book_slug: 'biology-2e',
                    book_id: 46,
                    heading: 'Instructor’s Manual',
                    resource_type: 'Instructor'
                }
            }
        ],
        ...overrides
    } as unknown as CTALinkFields;
}

function tableWithCells(rows: TableCellConfig[][]): TableBlockConfig {
    return {
        id: 'table-1',
        type: 'table',
        value: {
            caption: 'A table',
            columns: (rows[0] ?? []).map((_, i) => ({header: `Column ${i}`})),
            rows: rows.map((cells) => ({cells})),
            config: []
        }
    };
}

describe('findResourceRefs', () => {
    it('returns an empty array for a table with no resource_ref cells', () => {
        const data = tableWithCells([[{content: 'plain'}, {content: 'also plain'}]]);

        expect(findResourceRefs(data)).toEqual([]);
    });

    it('locates every resource_ref cell by row/column position', () => {
        const secondRefCta = resourceRefCta({
            config: [{
                type: 'resource_ref',
                value: {book_slug: 'university-physics', book_id: 47, heading: 'Test Bank', resource_type: 'Instructor'}
            }]
        });
        const data = tableWithCells([
            [{content: 'plain'}, {cta: [resourceRefCta()]}],
            [{cta: [secondRefCta]}, {content: 'plain'}]
        ]);

        expect(findResourceRefs(data)).toEqual([
            {rowIndex: 0, cellIndex: 1, ref: resourceRefCta().config[0].value},
            {rowIndex: 1, cellIndex: 0, ref: secondRefCta.config[0].value}
        ]);
    });

    it('ignores a cta with no resource_ref entry in its config', () => {
        const data = tableWithCells([[{cta: [resourceRefCta({config: [{type: 'style', value: 'orange'}]})]}]]);

        expect(findResourceRefs(data)).toEqual([]);
    });
});

describe('normalizeHeading', () => {
    it('matches across case and apostrophe-style differences', () => {
        expect(normalizeHeading('Instructor’s Manual')).toBe(normalizeHeading('INSTRUCTORS MANUAL'));
        expect(normalizeHeading("Instructor's  Manual")).toBe(normalizeHeading('instructor’s manual'));
    });

    it('collapses punctuation runs to a single space and trims', () => {
        expect(normalizeHeading('  Test--Bank!! ')).toBe('test bank');
    });
});

function facultyResourcesPayload(heading: string, extra: Record<string, unknown> = {}) {
    return {
        book_faculty_resources: [
            {
                resource: {heading, resource_unlocked: false},
                link_text: 'Download',
                link_document: {file: 'https://files.example.com/resource.pdf'},
                ...extra
            }
        ]
    };
}

function studentResourcesPayload(heading: string, extra: Record<string, unknown> = {}) {
    return {
        book_student_resources: [
            {
                resource_heading: heading,
                resource_unlocked: false,
                link_text: 'Visit site',
                link_external: 'https://partner.example.com/student-guide',
                ...extra
            }
        ]
    };
}

function ResolutionsHarness({refs}: {refs: Parameters<typeof useResourceRefResolutions>[0]}) {
    const resolutions = useResourceRefResolutions(refs);

    return <pre data-testid="resolutions">{JSON.stringify(resolutions)}</pre>;
}

function readResolutions() {
    return JSON.parse(screen.getByTestId('resolutions').textContent ?? '[]');
}

describe('useResourceRefResolutions', () => {
    beforeEach(() => {
        mockFetchFromCMS.mockReset();
        mockUseUserContext.mockReset();
    });

    it('reports loading for every ref before the fetch resolves', () => {
        mockUseUserContext.mockReturnValue({isVerified: true});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const refs = findResourceRefs(tableWithCells([[{cta: [resourceRefCta()]}]]));

        render(<ResolutionsHarness refs={refs} />);

        expect(readResolutions()).toEqual([{rowIndex: 0, cellIndex: 0, ref: refs[0].ref, status: 'loading'}]);
    });

    it('resolves to the matched resource and the marker’s own book_id once the fetch settles', async () => {
        mockUseUserContext.mockReturnValue({isVerified: true});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const refs = findResourceRefs(tableWithCells([[{cta: [resourceRefCta()]}]]));

        render(<ResolutionsHarness refs={refs} />);

        await waitFor(() => {
            const [resolution] = readResolutions();

            expect(resolution.status).toBe('resolved');
        });
        const [resolution] = readResolutions();

        expect(resolution.bookId).toBe(46);
        expect(resolution.resource.resource.heading).toBe('Instructor’s Manual');
        expect(mockFetchFromCMS).toHaveBeenCalledWith(expect.stringContaining('x=x'));
    });

    it('resolves to unmatched when the fetch succeeds but no heading matches', async () => {
        mockUseUserContext.mockReturnValue({isVerified: false});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Some Unrelated Resource'));
        const refs = findResourceRefs(tableWithCells([[{cta: [resourceRefCta()]}]]));

        render(<ResolutionsHarness refs={refs} />);

        await waitFor(() => {
            const [resolution] = readResolutions();

            expect(resolution.status).toBe('unmatched');
        });
        expect(mockFetchFromCMS).toHaveBeenCalledWith(expect.stringContaining('x=y'));
    });

    it('resolves a Student resource_ref against bookStudentResources via resourceHeading', async () => {
        mockUseUserContext.mockReturnValue({isVerified: false});
        mockFetchFromCMS.mockResolvedValue(studentResourcesPayload('Student Guide'));
        const studentCta = resourceRefCta({
            config: [{
                type: 'resource_ref',
                value: {book_slug: 'biology-2e', book_id: 46, heading: 'Student Guide', resource_type: 'Student'}
            }]
        });
        const refs = findResourceRefs(tableWithCells([[{cta: [studentCta]}]]));

        render(<ResolutionsHarness refs={refs} />);

        await waitFor(() => {
            const [resolution] = readResolutions();

            expect(resolution.status).toBe('resolved');
        });
        const [resolution] = readResolutions();

        expect(resolution.resource.resourceHeading).toBe('Student Guide');
        expect(resolution.bookId).toBe(46);
    });

    it('resolves to unmatched for a Student ref when the payload has no bookStudentResources at all', async () => {
        mockUseUserContext.mockReturnValue({isVerified: false});
        // books/resources/ is faculty-only today - no book_student_resources key.
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const studentCta = resourceRefCta({
            config: [{
                type: 'resource_ref',
                value: {book_slug: 'biology-2e', book_id: 46, heading: 'Student Guide', resource_type: 'Student'}
            }]
        });
        const refs = findResourceRefs(tableWithCells([[{cta: [studentCta]}]]));

        render(<ResolutionsHarness refs={refs} />);

        await waitFor(() => {
            const [resolution] = readResolutions();

            expect(resolution.status).toBe('unmatched');
        });
    });

    it('stays loading (never crashes) for a slug whose fetch errors', async () => {
        mockUseUserContext.mockReturnValue({isVerified: true});
        mockFetchFromCMS.mockResolvedValue({error: 'not found'});
        const refs = findResourceRefs(tableWithCells([[{cta: [resourceRefCta()]}]]));

        render(<ResolutionsHarness refs={refs} />);

        // Let the fetchFromCMS().then() -> Promise.all().then() chain fully
        // settle (setResourcesBySlug still fires with an empty map), then
        // confirm the resolution never advances past `loading`.
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        expect(readResolutions()).toEqual([{...refs[0], status: 'loading'}]);
    });

    it('ignores a fetch that resolves after unmount instead of updating unmounted state', async () => {
        mockUseUserContext.mockReturnValue({isVerified: true});
        const originalError = console.error;

        console.error = jest.fn();
        let resolveFetch: (value: unknown) => void = () => undefined;

        mockFetchFromCMS.mockImplementation(() => new Promise((resolve) => {
            resolveFetch = resolve;
        }));
        const refs = findResourceRefs(tableWithCells([[{cta: [resourceRefCta()]}]]));
        const {unmount} = render(<ResolutionsHarness refs={refs} />);

        unmount();
        resolveFetch(facultyResourcesPayload('Instructor’s Manual'));
        await Promise.resolve();
        await Promise.resolve();

        expect(console.error).not.toHaveBeenCalled();
        console.error = originalError;
    });

    it('resolves markers for two different books independently, using each marker’s own book_id', async () => {
        mockUseUserContext.mockReturnValue({isVerified: true});
        mockFetchFromCMS.mockImplementation((url: string) => (url.includes('slug=biology-2e')
            ? Promise.resolve(facultyResourcesPayload('Instructor’s Manual'))
            : Promise.resolve(facultyResourcesPayload('Test Bank'))));
        const refs = findResourceRefs(tableWithCells([
            [{cta: [resourceRefCta()]}],
            [{cta: [resourceRefCta({
                config: [{
                    type: 'resource_ref',
                    value: {
                        book_slug: 'university-physics',
                        book_id: 47,
                        heading: 'Test Bank',
                        resource_type: 'Instructor'
                    }
                }]
            })]}]
        ]));

        render(<ResolutionsHarness refs={refs} />);

        const allResolved = (resolutions: Array<{status: string}>) =>
            resolutions.every((r) => r.status === 'resolved');

        await waitFor(() => {
            expect(allResolved(readResolutions())).toBe(true);
        });
        const resolutions = readResolutions();

        expect(resolutions[0].bookId).toBe(46);
        expect(resolutions[1].bookId).toBe(47);
        expect(mockFetchFromCMS).toHaveBeenCalledTimes(2);
    });

    it('returns an empty array and fetches nothing when there are no refs', () => {
        mockUseUserContext.mockReturnValue({isVerified: false});

        render(<ResolutionsHarness refs={[]} />);

        expect(readResolutions()).toEqual([]);
        expect(mockFetchFromCMS).not.toHaveBeenCalled();
    });
});

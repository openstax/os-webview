import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import {LanguageContextProvider} from '~/contexts/language';
import type {
    TableBlockConfig,
    TableCellConfig,
    CTALinkFields
} from '~/pages/flex-page/blocks/table-resource-links-utils';

// The CMS/resources-API fixtures below are all snake_case (matching the real
// wire format the app camelCases at runtime).
/* eslint-disable camelcase */

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

const mockDelegateRender = jest.fn();

// @openstax/flex-page-renderer doesn't export `table` yet in the version this
// app currently pins (see TableResourceLinksBlock.tsx) - mock it here so the
// wrapper has something real to delegate to, and so we can inspect exactly
// what data it's handed.
jest.mock('@openstax/flex-page-renderer/blocks/index', () => ({
    table: {
        Component: (props: {data: unknown}) => {
            mockDelegateRender(props);
            return null;
        },
        config: {type: 'table', label: 'Table', categories: []}
    }
}));

// Imported after the mocks above so both modules pick up the mocked delegate
// at module-eval time (`tableDelegate` is computed once, at import).
import {TableResourceLinksBlock} from '~/pages/flex-page/blocks/TableResourceLinksBlock';
import {blockMap} from '~/pages/flex-page/block-map';

function Wrap({children}: React.PropsWithChildren) {
    return <LanguageContextProvider>{children}</LanguageContextProvider>;
}

function resourceRefCta(overrides: Partial<CTALinkFields> = {}): CTALinkFields {
    return {
        text: 'View on book page',
        aria_label: '',
        target: {value: '/details/books/biology-2e?Instructor%20resources', type: 'internal'},
        config: [
            {
                type: 'resource_ref',
                value: {book_slug: 'biology-2e', heading: 'Instructor’s Manual', resource_type: 'Instructor'}
            }
        ],
        ...overrides
    };
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

function lastDelegateData(): TableBlockConfig {
    const lastCall = mockDelegateRender.mock.calls[mockDelegateRender.mock.calls.length - 1];

    return lastCall[0].data as TableBlockConfig;
}

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
                resource: {heading},
                resource_unlocked: false,
                link_text: 'Visit site',
                link_external: 'https://partner.example.com/student-guide',
                ...extra
            }
        ]
    };
}

describe('TableResourceLinksBlock', () => {
    beforeEach(() => {
        mockDelegateRender.mockClear();
        mockFetchFromCMS.mockReset();
        mockUseUserContext.mockReset();
    });

    it('renders the delegate untouched with no fetch when there are no resource_ref cells', () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: false}, isVerified: false});
        const data = tableWithCells([[{content: 'plain cell'}, {content: 'another'}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        expect(mockDelegateRender).toHaveBeenCalledTimes(1);
        expect(mockDelegateRender.mock.calls[0][0].data).toBe(data);
        expect(mockFetchFromCMS).not.toHaveBeenCalled();
    });

    it('substitutes the real download link and text for a verified instructor', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const data = tableWithCells([[{cta: [resourceRefCta()]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

            expect(cta?.target.value).toBe('https://files.example.com/resource.pdf');
        });
        const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

        expect(cta?.text).toBe('Download');
        expect(cta?.target.type).toBe('internal');
        expect(mockFetchFromCMS).toHaveBeenCalledWith(expect.stringContaining('x=x'));
    });

    it('shows the Login to unlock state and never leaks the real file url when not verified', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: false}, isVerified: false});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const data = tableWithCells([[{cta: [resourceRefCta()]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

            expect(cta?.text).toBe('Login to unlock');
        });
        const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

        expect(cta?.target.value).not.toBe('https://files.example.com/resource.pdf');
        expect(cta?.target.value).not.toContain('files.example.com');
        expect(mockFetchFromCMS).toHaveBeenCalledWith(expect.stringContaining('x=y'));
    });

    it('leaves the CMS fallback link in place when no resource matches the heading', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Some Unrelated Resource'));
        const originalCta = resourceRefCta();
        const data = tableWithCells([[{cta: [originalCta]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => expect(mockFetchFromCMS).toHaveBeenCalled());
        await waitFor(() => {
            expect(lastDelegateData().value.rows[0].cells[0].cta?.[0]).toEqual(originalCta);
        });
    });

    it('matches headings normalized across case and apostrophe differences', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        // API heading differs from the marker's heading by case and apostrophe style.
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('INSTRUCTORS MANUAL'));
        const data = tableWithCells([[{cta: [resourceRefCta()]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

            expect(cta?.target.value).toBe('https://files.example.com/resource.pdf');
        });
    });

    it('resolves cells across two different books referenced by the same table', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockImplementation((url: string) => {
            if (url.includes('slug=biology-2e')) {
                return Promise.resolve(facultyResourcesPayload('Instructor’s Manual', {
                    link_document: {file: 'https://files.example.com/biology-im.pdf'}
                }));
            }
            if (url.includes('slug=university-physics')) {
                return Promise.resolve(facultyResourcesPayload('Instructor’s Manual', {
                    link_document: {file: 'https://files.example.com/physics-im.pdf'}
                }));
            }
            return Promise.resolve({book_faculty_resources: []});
        });
        const data = tableWithCells([
            [{cta: [resourceRefCta()]}],
            [{cta: [resourceRefCta({
                config: [{
                    type: 'resource_ref',
                    value: {
                        book_slug: 'university-physics',
                        heading: 'Instructor’s Manual',
                        resource_type: 'Instructor'
                    }
                }]
            })]}]
        ]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const row0 = lastDelegateData().value.rows[0].cells[0].cta?.[0];
            const row1 = lastDelegateData().value.rows[1].cells[0].cta?.[0];

            expect(row0?.target.value).toBe('https://files.example.com/biology-im.pdf');
            expect(row1?.target.value).toBe('https://files.example.com/physics-im.pdf');
        });
        expect(mockFetchFromCMS).toHaveBeenCalledTimes(2);
        expect(mockFetchFromCMS).toHaveBeenCalledWith(expect.stringContaining('slug=biology-2e'));
        expect(mockFetchFromCMS).toHaveBeenCalledWith(expect.stringContaining('slug=university-physics'));
    });

    it('never mutates the incoming block data object', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const data = tableWithCells([[{cta: [resourceRefCta()]}]]);
        const snapshot = JSON.parse(JSON.stringify(data));

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

            expect(cta?.target.value).toBe('https://files.example.com/resource.pdf');
        });
        expect(data).toEqual(snapshot);
        expect(lastDelegateData()).not.toBe(data);
    });

    it('leaves the CMS fallback for a pending-verification instructor (no link to offer)', async () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {isInstructor: false, pendingVerification: true},
            isVerified: false
        });
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const originalCta = resourceRefCta();
        const data = tableWithCells([[{cta: [originalCta]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => expect(mockFetchFromCMS).toHaveBeenCalled());
        await waitFor(() => {
            expect(lastDelegateData().value.rows[0].cells[0].cta?.[0]).toEqual(originalCta);
        });
    });

    it('leaves the CMS fallback for a Student resource_ref when no student-resources source exists', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isStudent: true}, isVerified: false});
        // books/resources/ only ever returns faculty resources today - no
        // bookStudentResources key at all.
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const originalCta = resourceRefCta({
            config: [{
                type: 'resource_ref',
                value: {book_slug: 'biology-2e', heading: 'Instructor’s Manual', resource_type: 'Student'}
            }]
        });
        const data = tableWithCells([[{cta: [originalCta]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => expect(mockFetchFromCMS).toHaveBeenCalled());
        await waitFor(() => {
            expect(lastDelegateData().value.rows[0].cells[0].cta?.[0]).toEqual(originalCta);
        });
    });

    it('leaves unrelated rows/cells alone when only some rows in the table resolve', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const plainRow = [{content: 'no marker here'}];
        const data = tableWithCells([[{cta: [resourceRefCta()]}], plainRow]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

            expect(cta?.target.value).toBe('https://files.example.com/resource.pdf');
        });
        expect(lastDelegateData().value.rows[1]).toEqual({cells: plainRow});
    });

    it('does not override table in blockMap: patching cell data alone drops download tracking', () => {
        // Rewriting a cell's cta yields the renderer's default bare <a>, which
        // never calls trackLink, so /salesforce/download-tracking/ is never hit
        // and no user-behavior adoption record is created. Registering this
        // override is gated on flex-page-renderer exposing a per-cell render
        // slot, so the cell can render the real resource-box button instead.
        // The renderer supplies its own `table` via ...blocks; what must not
        // happen is our wrapper replacing it.
        const registered = (blockMap as unknown as {table?: {Component?: unknown}}).table;

        expect(registered?.Component).not.toBe(TableResourceLinksBlock);
    });

    it('ignores a fetch that resolves after unmount instead of updating unmounted state', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        const originalError = console.error;

        console.error = jest.fn();
        let resolveFetch: (value: unknown) => void = () => undefined;

        mockFetchFromCMS.mockImplementation(() => new Promise((resolve) => {
            resolveFetch = resolve;
        }));
        const data = tableWithCells([[{cta: [resourceRefCta()]}]]);
        const {unmount} = render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        unmount();
        resolveFetch(facultyResourcesPayload('Instructor’s Manual'));
        await Promise.resolve();
        await Promise.resolve();

        expect(console.error).not.toHaveBeenCalled();
        console.error = originalError;
    });

    it('resolves a verified student to an external link (a second resource_type + external-link branch)', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isStudent: true}, isVerified: false});
        mockFetchFromCMS.mockResolvedValue(studentResourcesPayload('Student Guide'));
        const originalCta = resourceRefCta({
            config: [{
                type: 'resource_ref',
                value: {book_slug: 'biology-2e', heading: 'Student Guide', resource_type: 'Student'}
            }]
        });
        const data = tableWithCells([[{cta: [originalCta]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

            expect(cta?.target.value).toBe('https://partner.example.com/student-guide');
        });
        const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

        expect(cta?.target.type).toBe('external');
        expect(cta?.text).toBe('Visit site');
    });

    it('resolves two resource_ref cells in the same row independently', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue({
            book_faculty_resources: [
                {
                    resource: {heading: 'Instructor’s Manual', resource_unlocked: false},
                    link_text: 'Download manual',
                    link_document: {file: 'https://files.example.com/manual.pdf'}
                },
                {
                    resource: {heading: 'Test Bank', resource_unlocked: false},
                    link_text: 'Download tests',
                    link_document: {file: 'https://files.example.com/tests.pdf'}
                }
            ]
        });
        const secondCta = resourceRefCta({
            text: 'View on book page',
            config: [{
                type: 'resource_ref',
                value: {book_slug: 'biology-2e', heading: 'Test Bank', resource_type: 'Instructor'}
            }]
        });
        const data = tableWithCells([[{cta: [resourceRefCta()]}, {cta: [secondCta]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cells = lastDelegateData().value.rows[0].cells;

            expect(cells[0].cta?.[0]?.target.value).toBe('https://files.example.com/manual.pdf');
            expect(cells[1].cta?.[0]?.target.value).toBe('https://files.example.com/tests.pdf');
        });
    });

    it('patches only the marked cell and leaves a plain sibling cell in the same row untouched', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue(facultyResourcesPayload('Instructor’s Manual'));
        const plainCell = {content: 'no marker here'};
        const data = tableWithCells([[{cta: [resourceRefCta()]}, plainCell]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

            expect(cta?.target.value).toBe('https://files.example.com/resource.pdf');
        });
        expect(lastDelegateData().value.rows[0].cells[1]).toEqual(plainCell);
    });

    it('keeps the CMS fallback for a slug whose fetch fails without disturbing a sibling slug', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockImplementation((url: string) => (url.includes('slug=broken-book')
            ? Promise.resolve({error: 'not found'})
            : Promise.resolve(facultyResourcesPayload('Instructor’s Manual'))));
        const brokenCta = resourceRefCta({
            config: [{
                type: 'resource_ref',
                value: {book_slug: 'broken-book', heading: 'Instructor’s Manual', resource_type: 'Instructor'}
            }]
        });
        const data = tableWithCells([
            [{cta: [resourceRefCta()]}],
            [{cta: [brokenCta]}]
        ]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const cta = lastDelegateData().value.rows[0].cells[0].cta?.[0];

            expect(cta?.target.value).toBe('https://files.example.com/resource.pdf');
        });
        await waitFor(() => {
            expect(lastDelegateData().value.rows[1].cells[0].cta?.[0]).toEqual(brokenCta);
        });
    });
});

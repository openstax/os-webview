import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/preact';
import type {CTALinkFields} from '@openstax/flex-page-renderer/blocks/CTABlock.config';
import type {
    TableBlockConfig,
    TableCellConfig,
    TableColumnConfig
} from '@openstax/flex-page-renderer/blocks/TableBlock.config';
import {LanguageContextProvider} from '~/contexts/language';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {TableResourceLinksBlock} from '~/pages/flex-page/blocks/TableResourceLinksBlock';

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

// This file renders the real @openstax/flex-page-renderer table block (its
// TableCellContext slot is what's under test) - the CMS/resources-API
// fixtures below are all snake_case (matching the real wire format the app
// camelCases at runtime).
/* eslint-disable camelcase */

function Wrap({children}: React.PropsWithChildren) {
    return (
        <MemoryRouter initialEntries={['/some-flex-page']}>
            <LanguageContextProvider>{children}</LanguageContextProvider>
        </MemoryRouter>
    );
}

function resourceRefCta(overrides: Partial<Omit<CTALinkFields, 'config'>> & {config?: unknown[]} = {}): CTALinkFields {
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

function tableWithCells(
    columns: TableColumnConfig[],
    rows: TableCellConfig[][],
    config: TableBlockConfig['value']['config'] = []
): TableBlockConfig {
    return {
        id: 'table-1',
        type: 'table',
        value: {caption: 'A table', columns, rows: rows.map((cells) => ({cells})), config}
    };
}

function facultyResourcesPayload(heading: string, file: string) {
    return {
        book_faculty_resources: [
            {
                resource: {heading, resource_unlocked: false},
                link_text: 'Download',
                link_document: {file}
            }
        ]
    };
}

describe('TableResourceLinksBlock', () => {
    beforeEach(() => {
        mockFetchFromCMS.mockReset();
        mockUseUserContext.mockReset();
    });

    it('renders the delegate for a marker-free table with no fetch', () => {
        mockUseUserContext.mockReturnValue({userStatus: {}, isVerified: false});
        const data = tableWithCells(
            [{header: 'A'}, {header: 'B'}],
            [[{content: 'hello'}, {content: 'world'}]]
        );

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        expect(screen.getByText('hello')).toBeTruthy();
        expect(screen.getByText('world')).toBeTruthy();
        expect(mockFetchFromCMS).not.toHaveBeenCalled();
    });

    it('renders the real button for a resolved marker; its sibling cell keeps the delegate default', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue(
            facultyResourcesPayload('Instructor’s Manual', 'https://files.example.com/resource.pdf')
        );
        const data = tableWithCells(
            [{header: 'Resource'}, {header: 'Notes'}],
            [[{cta: [resourceRefCta()]}, {content: 'a note'}]]
        );

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const link = screen.getByRole<HTMLAnchorElement>('link');

            expect(link.href).toBe('https://files.example.com/resource.pdf');
        });
        expect(screen.getByText('a note')).toBeTruthy();
    });

    it('shows the CMS fallback link while loading, and still shows it once resolved to unmatched', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue(
            facultyResourcesPayload('Some Unrelated Heading', 'https://files.example.com/other.pdf')
        );
        const data = tableWithCells([{header: 'Resource'}], [[{cta: [resourceRefCta()]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        // Loading: the fetch hasn't resolved yet, the cell data was never
        // touched, so the CMS's own fallback CTA is exactly what's there.
        expect(screen.getByRole<HTMLAnchorElement>('link').textContent).toBe('View on book page');

        await waitFor(() => expect(mockFetchFromCMS).toHaveBeenCalled());
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        // Unmatched: still the same untouched fallback, not an empty cell.
        const link = screen.getByRole<HTMLAnchorElement>('link');

        expect(link.textContent).toBe('View on book page');
        expect(link.href).not.toContain('other.pdf');
    });

    it('resolves each marker to its own authored row after the delegate sorts the display order', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockImplementation((url: string) => (url.includes('slug=biology-2e')
            ? Promise.resolve(facultyResourcesPayload('Instructor’s Manual', 'https://files.example.com/biology-im.pdf'))
            : Promise.resolve(facultyResourcesPayload('Test Bank', 'https://files.example.com/physics-tb.pdf'))));

        // Authored order: row 0 = "Zed"/physics, row 1 = "Alpha"/biology-2e.
        // default_sort_column sorts column 1 (Name) ascending on mount, so
        // the display order becomes Alpha, then Zed - the reverse of
        // authored order. Each row's resource must still follow ITS OWN
        // authored row, not the row it now visually appears in.
        const data = tableWithCells(
            [{header: 'Name', type: 'text'}, {header: 'Resource'}],
            [
                [{content: 'Zed'}, {cta: [resourceRefCta({
                    config: [{
                        type: 'resource_ref',
                        value: {
                            book_slug: 'university-physics',
                            book_id: 47,
                            heading: 'Test Bank',
                            resource_type: 'Instructor'
                        }
                    }]
                })]}],
                [{content: 'Alpha'}, {cta: [resourceRefCta()]}]
            ],
            [
                {type: 'default_sort_column', id: 'dsc', value: '1'},
                {type: 'default_sort_direction', id: 'dsd', value: 'asc'}
            ]
        );

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => {
            const alphaRow = screen.getByText('Alpha').closest('tr');

            expect(within(alphaRow as HTMLElement).getByRole<HTMLAnchorElement>('link').href)
                .toBe('https://files.example.com/biology-im.pdf');
        });

        const rows = screen.getAllByRole('row');
        const alphaRowIndex = rows.findIndex((r) => r.textContent?.includes('Alpha'));
        const zedRowIndex = rows.findIndex((r) => r.textContent?.includes('Zed'));

        // Confirms the sort actually reordered the display (Alpha before
        // Zed) - otherwise the assertion above wouldn't be exercising
        // anything.
        expect(alphaRowIndex).toBeLessThan(zedRowIndex);

        const zedRow = screen.getByText('Zed').closest('tr');

        expect(within(zedRow as HTMLElement).getByRole<HTMLAnchorElement>('link').href)
            .toBe('https://files.example.com/physics-tb.pdf');
    });
});

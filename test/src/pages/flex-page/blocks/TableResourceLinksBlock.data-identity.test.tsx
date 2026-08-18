import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import type {CTALinkFields} from '@openstax/flex-page-renderer/blocks/CTABlock.config';
import type {TableBlockConfig, TableCellConfig} from '@openstax/flex-page-renderer/blocks/TableBlock.config';
import {LanguageContextProvider} from '~/contexts/language';

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

// The wrapper never clones/patches block data - it hands `data` straight to
// the delegate and supplies content only through TableCellContext. Proving
// "same object reference" requires intercepting what the delegate actually
// receives, which means mocking the delegate itself (TableResourceLinksBlock
// captures `blocks.table.Component` once at module-eval time, so this has to
// be in place before that module is first imported).
jest.mock('@openstax/flex-page-renderer/blocks/index', () => ({
    ...jest.requireActual('@openstax/flex-page-renderer/blocks/index'),
    table: {
        Component: (props: {data: unknown}) => {
            mockDelegateRender(props);
            return null;
        },
        config: {type: 'table', label: 'Table', categories: ['content']}
    }
}));

import {TableResourceLinksBlock} from '~/pages/flex-page/blocks/TableResourceLinksBlock';
import {blockMap} from '~/pages/flex-page/block-map';

// resource_ref markers are snake_case (the CMS/marker contract).
/* eslint-disable camelcase */

function Wrap({children}: React.PropsWithChildren) {
    return <LanguageContextProvider>{children}</LanguageContextProvider>;
}

function resourceRefCta(): CTALinkFields {
    return {
        text: 'View on book page',
        aria_label: '',
        target: {value: '/details/books/biology-2e?Instructor%20resources', type: 'internal'},
        config: [
            {
                type: 'resource_ref',
                value: {
                    bookSlug: 'biology-2e',
                    bookId: 46,
                    heading: 'Instructor’s Manual',
                    resourceType: 'Instructor'
                }
            }
        ]
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

describe('TableResourceLinksBlock data identity', () => {
    beforeEach(() => {
        mockDelegateRender.mockClear();
        mockFetchFromCMS.mockReset();
        mockUseUserContext.mockReset();
    });

    it('hands the delegate the exact same data object for a marker-free table', () => {
        mockUseUserContext.mockReturnValue({userStatus: {}, isVerified: false});
        const data = tableWithCells([[{content: 'plain'}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        expect(mockDelegateRender).toHaveBeenCalledTimes(1);
        expect(mockDelegateRender.mock.calls[0][0].data).toBe(data);
    });

    it('hands the delegate the exact same data object even once a marker resolves', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue({
            book_faculty_resources: [{
                resource: {heading: 'Instructor’s Manual', resource_unlocked: false},
                link_text: 'Download',
                link_document: {file: 'https://files.example.com/resource.pdf'}
            }]
        });
        const data = tableWithCells([[{cta: [resourceRefCta()]}]]);

        render(<Wrap><TableResourceLinksBlock data={data} /></Wrap>);

        await waitFor(() => expect(mockFetchFromCMS).toHaveBeenCalled());
        await Promise.resolve();
        await Promise.resolve();

        mockDelegateRender.mock.calls.forEach((call) => {
            expect(call[0].data).toBe(data);
        });
        expect(mockDelegateRender.mock.calls.length).toBeGreaterThan(0);
    });

    it('is registered in blockMap as the table override', () => {
        expect(blockMap.table.Component).toBe(TableResourceLinksBlock);
        expect(blockMap.table.config).toEqual({type: 'table', label: 'Table', categories: ['content']});
    });
});

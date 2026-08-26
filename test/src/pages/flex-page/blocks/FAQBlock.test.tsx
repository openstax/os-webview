import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import {LanguageContextProvider} from '~/contexts/language';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {FAQBlock, type FAQBlockConfig} from '~/pages/flex-page/blocks/FAQBlock';

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

/* eslint-disable camelcase */

function Wrap({children}: React.PropsWithChildren) {
    return (
        <MemoryRouter initialEntries={['/some-flex-page']}>
            <LanguageContextProvider>{children}</LanguageContextProvider>
        </MemoryRouter>
    );
}

// A faq whose item content nests a table carrying a resource_ref marker -
// the k12 subject pages' structure. The marker keys are camelCase because
// usePageData camelCases the page payload before blocks see it.
function faqWithMarkedTable(): FAQBlockConfig {
    return {
        id: 'faq-1',
        type: 'faq',
        value: [{
            id: 'q1',
            value: {
                question: 'Answer Guides',
                slug: 'answer-guides',
                answer: '<p>the guides</p>',
                document: null,
                content: [{
                    id: 'table-1',
                    type: 'table',
                    value: {
                        caption: '',
                        columns: [{header: 'Resource'}],
                        rows: [{
                            cells: [{
                                content: '',
                                cta: [{
                                    text: 'View on book page',
                                    aria_label: '',
                                    target: {value: '/details/books/biology-2e?Instructor%20resources', type: 'internal'},
                                    config: [{
                                        type: 'resource_ref',
                                        value: {
                                            bookSlug: 'biology-2e',
                                            bookId: 46,
                                            heading: 'Instructor’s Manual',
                                            resourceType: 'Instructor'
                                        }
                                    }]
                                }]
                            }]
                        }],
                        config: []
                    }
                } as unknown as NonNullable<FAQBlockConfig['value'][number]['value']['content']>[number]]
            }
        }]
    };
}

describe('FAQBlock', () => {
    beforeEach(() => {
        mockFetchFromCMS.mockReset();
        mockUseUserContext.mockReset();
    });

    // Regression: FAQBlock used to hand ContentBlockRoot the renderer's raw
    // block set, so a table nested in a faq item rendered the stock
    // TableBlock and its resource_ref cells never resolved past the CMS's
    // "View on book page" fallback.
    it('resolves resource_ref markers in tables nested inside faq items', async () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: true}, isVerified: true});
        mockFetchFromCMS.mockResolvedValue({
            book_faculty_resources: [{
                resource: {heading: 'Instructor’s Manual', resource_unlocked: false},
                link_text: 'Download',
                link_document: {file: 'https://files.example.com/resource.pdf'}
            }]
        });

        render(<Wrap><FAQBlock data={faqWithMarkedTable()} /></Wrap>);

        await waitFor(() => {
            expect(mockFetchFromCMS).toHaveBeenCalledWith(
                expect.stringContaining('books/resources/?slug=biology-2e')
            );
        });
        await waitFor(() => {
            const link = document.querySelector('a[href="https://files.example.com/resource.pdf"]');

            expect(link).not.toBe(null);
        });
        expect(screen.getByText('Answer Guides')).toBeTruthy();
    });
});

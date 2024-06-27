import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, waitFor} from '@testing-library/preact';
import useDocumentHead, {
    setPageTitleAndDescriptionFromBookData,
    getPageDescription,
    useCanonicalLink
} from '~/helpers/use-document-head';
import {MemoryRouter} from 'react-router-dom';

describe('use-document-head', () => {
    console.warn = jest.fn();

    it('sets title when there is no place for description', async () => {
        const Component = () => {
            useDocumentHead({
                title: 'name',
                description: 'the description'
            });

            return null;
        };

        render(<Component />);
        await waitFor(() => expect(document.title).toBe('name - OpenStax'));
        expect(console.warn).toHaveBeenCalledWith(
            'No description meta entry in page header'
        );
        jest.resetAllMocks();
    });
    it('sets default title and description', async () => {
        const descEl = document.createElement('meta');
        const Component = () => {
            useDocumentHead({
                description: 'the description'
            });

            return null;
        };

        descEl.setAttribute('name', 'description');
        document.head.appendChild(descEl);
        render(<Component />);
        await waitFor(() => expect(document.title).toBe('OpenStax'));

        expect(getPageDescription()).toBe('the description');
        expect(console.warn).not.toHaveBeenCalled();
    });
    it('sets noindex', async () => {
        const Component = () => {
            useDocumentHead({
                noindex: true
            });

            return null;
        };

        render(<Component />);
        await waitFor(() => {
            const robotsEl = document.querySelector('head meta[name="robots"]');

            return expect(robotsEl?.getAttribute('content')).toBe('noindex');
        });
    });
    it('sets from (empty) book data', async () => {
        const Component = () => {
            React.useEffect(() => setPageTitleAndDescriptionFromBookData(), []);

            return null;
        };

        render(<Component />);
        await waitFor(() => expect(document.title).toBe('OpenStax'));

        expect(getPageDescription()).toBe(
            'Access our free college textbooks and low-cost learning materials.'
        );
        expect(console.warn).not.toHaveBeenCalled();
    });
    it('sets from blog data', async () => {
        const data = {
            id: 512,
            meta: {
                slug: 'meet-the-author-series-dr-rachel-bzostek-walker-introduction-to-political-science',
                seoTitle: 'Test of the blog OG data',
                searchDescription:
                    'This should display this description to social sites.',
                type: 'news.NewsArticle',
                locale: 'en'
            },
            collections: [
                {
                    type: 'collection',
                    value: [
                        {
                            collection: {
                                name: 'OpenStax Updates'
                            }
                        }
                    ]
                },
                {
                    type: 'collection',
                    name: 'Direct name'
                }
            ],
            articleSubjects: [
                {
                    type: 'subject',
                    value: [
                        {
                            subject: {
                                name: 'Humanities'
                            },
                            featured: false
                        }
                    ]
                },
                {
                    type: 'subject',
                    name: 'Subname 2'
                }
            ],
            contentTypes: [],
            slug: 'news/meet-the-author-series-dr-rachel-bzostek-walker-introduction-to-political-science'
        };
        const Component = () => {
            React.useEffect(
                () => setPageTitleAndDescriptionFromBookData(data),
                []
            );

            return null;
        };

        render(<Component />);
        await waitFor(() =>
            expect(document.title).toBe(`${data.meta.seoTitle} - OpenStax`)
        );

        expect(getPageDescription()).toBe(data.meta.searchDescription);
        expect(console.warn).not.toHaveBeenCalled();
    });
    it('sets from book data', async () => {
        const data = {
            id: 74,
            meta: {
                slug: 'calculus-volume-1',
                seoTitle:
                    'Free Calculus Volume 1 Textbook Available for Download',
                searchDescription: `Study calculus online free by downloading volume 1 of OpenStax's college
                    Calculus textbook and using our accompanying online resources.`,
                locale: 'en'
            },
            title: 'Calculus Volume 1',
            bookSubjects: [
                {
                    id: 177,
                    meta: {
                        type: 'books.BookSubjects'
                    },
                    subjectName: 'Math',
                    subjectPageContent:
                        'About this much text. Lorem ipsum dolor sit amet, consectetur ...',
                    subjectSearchDescription: 'This is math search meta'
                }
            ],
            bookCategories: [
                {
                    id: 18,
                    meta: {
                        type: 'books.BookCategories'
                    },
                    subjectName: 'Math',
                    subjectCategory: 'Calculus'
                }
            ],
            description: 'some HTML description',
            k12bookSubjects: [],
            bookStudentResources: [],
            bookFacultyResources: [],
            publishDate: '2016-03-30',
            authors: [],
            printIsbn13: '978-1-938168-02-4',
            slug: 'books/calculus-volume-1'
        };
        const Component = () => {
            React.useEffect(
                () => setPageTitleAndDescriptionFromBookData(data),
                []
            );

            return null;
        };

        render(<Component />);
        await waitFor(() =>
            expect(document.title).toBe(`${data.meta.seoTitle} - OpenStax`)
        );

        expect(getPageDescription()).toBe(data.meta.searchDescription);
        expect(console.warn).not.toHaveBeenCalled();
    });
});

// The above created a <title> in <head> that is used below

describe('useCanonicalLink', () => {
    it('sets nothing when arg is false', () => {
        const Component = () => {
            useCanonicalLink(false);
            return null;
        };

        render(
            <MemoryRouter initialEntries={['/foo/dir']}>
                <Component />
            </MemoryRouter>
        );
        expect(document.head.querySelector('link')).toBeNull();
    });
    it('sets link with default args', () => {
        const canonicalPath = '/canonical/path';
        const Component = () => {
            useCanonicalLink();
            return null;
        };

        render(
            <MemoryRouter initialEntries={[canonicalPath]}>
                <Component />
            </MemoryRouter>
        );
        expect(
            document.head.querySelector('link')?.getAttribute('href')
        ).toContain(canonicalPath);
    });
    it('handles fails gracefully if there is no title', () => {
        const titleEl = document.head.querySelector('title');

        if (titleEl) {
            document.head.removeChild(titleEl);
        }
        const canonicalPath = '/canonical/path';
        const Component = () => {
            useCanonicalLink();
            return null;
        };

        render(
            <MemoryRouter initialEntries={[canonicalPath]}>
                <Component />
            </MemoryRouter>
        );
        expect(document.head.querySelector('link')).toBeNull();
    });
});

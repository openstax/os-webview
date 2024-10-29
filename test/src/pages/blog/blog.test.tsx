import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import {BrowserRouter, MemoryRouter, Routes, Route} from 'react-router-dom';
import useBlogContext, {
    BlogContextProvider,
    assertTType
} from '~/pages/blog/blog-context';
import {
    MainBlogPage,
    ArticlePage,
    SearchResultsPage
} from '~/pages/blog/blog-pages';
import {MainClassContextProvider} from '~/contexts/main-class';
import {describe, test, expect} from '@jest/globals';
import * as PDU from '~/helpers/page-data-utils';

describe('blog pages', () => {
    beforeAll(() => {
        const description = document.createElement('meta');

        description.setAttribute('name', 'description');
        document.head.appendChild(description);
    });
    test('Main page', async () => {
        render(
            <BrowserRouter>
                <BlogContextProvider>
                    <MainClassContextProvider>
                        <MainBlogPage />
                    </MainClassContextProvider>
                </BlogContextProvider>
            </BrowserRouter>
        );
        expect(await screen.findAllByText('Read more')).toHaveLength(3);
        expect(screen.queryAllByRole('textbox')).toHaveLength(1);
    });

    test('Article page', async () => {
        window.scrollTo = jest.fn();

        render(
            <MemoryRouter initialEntries={['/blog/blog-article']}>
                <BlogContextProvider>
                    <Routes>
                        <Route path="/blog/:slug" element={<ArticlePage />} />
                    </Routes>
                </BlogContextProvider>
            </MemoryRouter>
        );
        expect(await screen.findAllByText('Read more')).toHaveLength(3);
        expect(screen.queryAllByRole('link')).toHaveLength(7);
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    test('Search Results page', async () => {
        /* eslint-disable camelcase, max-len */
        jest.spyOn(PDU, 'fetchFromCMS').mockResolvedValueOnce(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => ({
                id,
                slug: `slug-${id}`,
                collections: [],
                article_subjects: []
            }))
        );

        render(
            <MemoryRouter initialEntries={['/blog/?q=education']}>
                <SearchResultsPage />
            </MemoryRouter>
        );
        expect(document.head.querySelector('title')?.textContent).toBe(
            'OpenStax Blog Search'
        );
    });

    test('assertTType throws for invalid value', () => {
        expect(() => assertTType('invalid')).toThrowError();
    });

    test('blog-context searchFor', async () => {
        function Inner() {
            const {searchFor} = useBlogContext();

            React.useEffect(() => searchFor('education'), [searchFor]);

            return null;
        }

        function Outer() {
            return (
                <MemoryRouter initialEntries={['/blog/blog-article']}>
                    <BlogContextProvider>
                        <Inner />
                    </BlogContextProvider>
                </MemoryRouter>
            );
        }

        window.scrollTo = jest.fn();

        render(<Outer />);
        await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith(0, 0));
    });
});

import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import {Routes, Route} from 'react-router-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import useBlogContext, {
    BlogContextProvider,
    assertTType
} from '~/pages/blog/blog-context';
import BlogLoader from '~/pages/blog/blog';
import {
    ArticlePage
} from '~/pages/blog/blog-pages';
import {describe, test, expect} from '@jest/globals';

// Mount BlogLoader the way production does: under the `/:dir/*` catch-all, so
// the component's own <Routes> resolve relative to /blog (path="" matches the
// blog landing). Mounting it bare would make /blog/ fall through to the :slug
// article route.
function renderLoader(entry: string) {
    return render(
        <MemoryRouter initialEntries={[entry]}>
            <Routes>
                <Route path="/blog/*" element={<BlogLoader />} />
            </Routes>
        </MemoryRouter>
    );
}

describe('blog pages', () => {
    beforeAll(() => {
        const description = document.createElement('meta');

        description.setAttribute('name', 'description');
        document.head.appendChild(description);
    });
    test('Loader page for Main page', async () => {
        renderLoader('/blog/');
        expect(await screen.findAllByText('Read more')).toHaveLength(3);
        expect(screen.queryAllByRole('textbox')).toHaveLength(1);
    });
    test('Loader page for Search results', async () => {
        renderLoader('/blog/?q=education');
        // Actual search results are tested below; this just exercises the branch
        await waitFor(() => expect(document.querySelector('.blog.page')).toBeTruthy());
    });
    test('Loader page with UTM parameters shows main page, not search', async () => {
        renderLoader('/blog/?utm_source=email&utm_campaign=newsletter');
        // UTM params are not a search query, so the main (discovery) page shows.
        // Heading comes from the CMS news page (fixture title: "Openstax News").
        expect(
            await screen.findByRole('heading', {level: 1, name: 'Openstax News'})
        ).toBeTruthy();
        expect(document.querySelector('.blog.page')).toBeTruthy();
        expect(screen.queryByText('No matching blog posts found')).toBeNull();
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

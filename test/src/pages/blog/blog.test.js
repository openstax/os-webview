import React from 'react';
import {render, screen} from '@testing-library/preact';
import {BrowserRouter, MemoryRouter, Routes, Route} from 'react-router-dom';
import {BlogContextProvider} from '~/pages/blog/blog-context';
import {BlogPage, MainBlogPage, ArticlePage} from '~/pages/blog/blog';

test('blog default page', async () => {
    render(
        <BrowserRouter>
            <BlogContextProvider>
                <MainBlogPage />
            </BlogContextProvider>
        </BrowserRouter>
    );
    expect(await screen.findAllByText('Read more')).toHaveLength(4);
    expect(screen.queryAllByRole('textbox')).toHaveLength(1);
});

test('blog Article page', async () => {
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
    expect(screen.queryAllByRole('link')).toHaveLength(20);
});

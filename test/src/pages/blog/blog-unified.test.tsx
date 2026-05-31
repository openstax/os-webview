import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {BlogContextProvider} from '~/pages/blog/blog-context';
import {MainBlogPage} from '~/pages/blog/blog-pages';
import {describe, it} from '@jest/globals';
import * as pageDataUtils from '~/helpers/page-data-utils';

function renderMainBlog(initialEntry: string) {
    render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <BlogContextProvider>
                <MainBlogPage />
            </BlogContextProvider>
        </MemoryRouter>
    );
}

describe('Unified MainBlogPage', () => {
    it('shows facet controls when a query is present', async () => {
        renderMainBlog('/blog/?q=algebra');
        await waitFor(() =>
            expect(screen.getByRole('group', {name: 'Filter by subject'})).toBeInTheDocument()
        );
        expect(screen.queryByText('Explore by subject')).not.toBeInTheDocument();
    });

    it('shows discovery content and facet controls when no query or facets', async () => {
        renderMainBlog('/blog/');
        await waitFor(() =>
            expect(screen.getByText('Explore by subject')).toBeInTheDocument()
        );
        expect(screen.getByRole('group', {name: 'Filter by subject'})).toBeInTheDocument();
    });

    it('shows no-results message AND keeps facet controls visible when search returns empty', async () => {
        jest.spyOn(pageDataUtils, 'fetchFromCMS').mockResolvedValue([]);
        renderMainBlog('/blog/?q=zzzznomatch');
        expect(
            await screen.findByText(/No matching blog posts found/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole('group', {name: 'Filter by subject'})
        ).toBeInTheDocument();
        jest.restoreAllMocks();
    });
});

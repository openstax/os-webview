import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it, expect} from '@jest/globals';
import {BrowserRouter} from 'react-router-dom';
import {BlogContextProvider} from '~/pages/blog/blog-context';
import ShellContextProvider from '~/../../test/helpers/shell-context';

import LatestBlogPosts from '~/pages/blog/latest-blog-posts/latest-blog-posts';

function Component() {
    return (
        <BrowserRouter>
            <ShellContextProvider>
                <BlogContextProvider>
                    <LatestBlogPosts />
                </BlogContextProvider>
            </ShellContextProvider>
        </BrowserRouter>
    );
}

describe('blog/latest-blog-posts', () => {
    it('renders Latest Blog Posts page', async () => {
        window.scrollTo = jest.fn();
        render(<Component />);

        await screen.findAllByText('Search all blog posts');
        screen.getByText('showing 1-9 of', {exact: false});
        expect(screen.getAllByRole('button')).toHaveLength(4);
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
});

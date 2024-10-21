import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it, expect} from '@jest/globals';
import ExplorePage from '~/pages/blog/explore-page/explore-page';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { BlogContextProvider } from '~/pages/blog/blog-context';

function Component({path}: {path: string}) {
    return (
        <MemoryRouter basename='/blog' initialEntries={[path]}>
            <BlogContextProvider>
                <Routes>
                    <Route
                        path='explore/:exploreType/:topic'
                        element={<ExplorePage />}
                    />
                </Routes>
            </BlogContextProvider>
        </MemoryRouter>
    );
}

describe('blog/explore-page', () => {
    it('renders Explore collection page layout', async () => {
        render(<Component path='/blog/explore/collections/Teaching and Learning' />);

        expect(await screen.findAllByText('Teaching and Learning')).toHaveLength(3);
    });
    it('renders Explore subject page layout', async () => {
        render(<Component path='/blog/explore/subjects/Math' />);

        expect(await screen.findAllByText('OpenStax Math Textbooks')).toHaveLength(4);
    });
});

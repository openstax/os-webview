import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render} from '@testing-library/preact';
import PinnedArticle from '~/pages/blog/pinned-article/pinned-article';
import {LatestBlurbs} from '~/pages/blog/more-stories/more-stories';
import useAllArticles from '~/pages/blog/search-results/use-all-articles';
import {MemoryRouter} from 'react-router-dom';
import SearchResults from '~/pages/blog/search-results/search-results';

jest.mock('~/pages/blog/pinned-article/pinned-article', () => jest.fn());
jest.mock('~/pages/blog/more-stories/more-stories', () => ({
    LatestBlurbs: jest.fn()
}));
jest.mock('~/pages/blog/search-results/use-all-articles', () => jest.fn());

function Component() {
    return (
        <MemoryRouter initialEntries={['/blog/?q=education']}>
            <SearchResults />
        </MemoryRouter>
    );
}

describe('search-results', () => {
    it('renders no results when there are no articles', () => {
        (useAllArticles as jest.Mock).mockReturnValueOnce([]);
        render(<Component />);
        expect(PinnedArticle).toHaveBeenCalled();
        expect(LatestBlurbs).toHaveBeenCalled();
        jest.clearAllMocks();
    });
    it('renders with paginator context when there are articles', () => {
        (useAllArticles as jest.Mock).mockReturnValueOnce([
            {
                articleSlug: 'whatever',
                collectionNames: [],
                articleSubjectNames: []
            },
            {
                articleSlug: 'second',
                collectionNames: [],
                articleSubjectNames: []
            }
        ]);
        render(<Component />);
        expect(PinnedArticle).not.toHaveBeenCalled();
    });
});

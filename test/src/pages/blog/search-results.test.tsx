import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/preact';
import PinnedArticle from '~/pages/blog/pinned-article/pinned-article';
import {LatestBlurbs} from '~/pages/blog/more-stories/more-stories';
import {MemoryRouter} from 'react-router-dom';
import SearchResults from '~/pages/blog/search-results/search-results';
import * as PDU from '~/helpers/page-data-utils';
import * as AS from '~/pages/blog/article-summary/article-summary';

jest.mock('~/pages/blog/pinned-article/pinned-article', () => jest.fn());
jest.mock('~/pages/blog/more-stories/more-stories', () => ({
    LatestBlurbs: jest.fn()
}));

function Component() {
    return (
        <MemoryRouter initialEntries={['/blog/?q=education']}>
            <SearchResults />
        </MemoryRouter>
    );
}

describe('search-results', () => {
    it('renders no results when there are no articles', async () => {
        jest.spyOn(PDU, 'fetchFromCMS').mockResolvedValueOnce([]);
        render(<Component />);
        expect(PinnedArticle).toHaveBeenCalled();
        expect(LatestBlurbs).toHaveBeenCalled();
        await screen.findByText('No matching blog posts found');
        jest.clearAllMocks();
    });
    it('renders with paginator context when there are articles', async () => {
        /* eslint-disable camelcase, max-len */
        jest.spyOn(PDU, 'fetchFromCMS').mockResolvedValueOnce(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => ({
                id,
                slug: `slug-${id}`,
                collections: [],
                article_subjects: []
            }))
        );
        const spyArticleSummary = jest.spyOn(AS, 'default');

        render(<Component />);

        expect(await screen.findAllByText('Read more')).toHaveLength(10);
        screen.getByText('1-10 of 12', {exact: false});
        expect(spyArticleSummary).toHaveBeenCalledTimes(10);
        // Focus is set to the first article
        await waitFor(
            () => expect(document.activeElement?.tagName).toBe('A')
        );
    });
});

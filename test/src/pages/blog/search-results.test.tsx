import React from 'react';
import '@testing-library/jest-dom';
import {describe, it} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/preact';
import PinnedArticle from '~/pages/blog/pinned-article/pinned-article';
import {LatestBlurbs} from '~/pages/blog/more-stories/more-stories';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import SearchResults from '~/pages/blog/search-results/search-results';
import * as PDU from '~/helpers/page-data-utils';
import * as AS from '~/pages/blog/article-summary/article-summary';

jest.mock('~/pages/blog/pinned-article/pinned-article', () => jest.fn());
jest.mock('~/pages/blog/more-stories/more-stories', () => ({
    LatestBlurbs: jest.fn()
}));

function Component({entry = '/blog/?q=education'}: {entry?: string}) {
    return (
        <MemoryRouter initialEntries={[entry]}>
            <SearchResults />
        </MemoryRouter>
    );
}

function twelveArticles() {
    /* eslint-disable-next-line camelcase */
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => ({
        id,
        slug: `slug-${id}`,
        collections: [],
        article_subjects: [] // eslint-disable-line camelcase
    }));
}

describe('search-results', () => {
    it('renders no results when there are no articles', async () => {
        jest.spyOn(PDU, 'fetchFromCMS').mockResolvedValueOnce([]);
        render(<Component />);
        await screen.findByText('No matching blog posts found');
        // Discovery content is offered alongside the no-results message.
        expect(PinnedArticle).toHaveBeenCalled();
        expect(LatestBlurbs).toHaveBeenCalled();
        jest.clearAllMocks();
    });
    it('does not flash no-results while a search is still loading', async () => {
        // A fetch that never resolves keeps the component in its loading state.
        jest.spyOn(PDU, 'fetchFromCMS').mockReturnValue(new Promise(() => undefined));
        render(<Component />);

        expect(
            screen.queryByText('No matching blog posts found')
        ).not.toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Searching blog posts');
        jest.clearAllMocks();
    });
    it('renders with paginator context when there are articles', async () => {
        jest.spyOn(PDU, 'fetchFromCMS').mockResolvedValueOnce(twelveArticles());
        const spyArticleSummary = jest.spyOn(AS, 'default');

        render(<Component />);

        expect(await screen.findAllByText('Read more')).toHaveLength(10);
        screen.getByText('1-10 of 12', {exact: false});
        expect(spyArticleSummary).toHaveBeenCalledTimes(10);
    });
    it('announces the result count to screen readers', async () => {
        jest.spyOn(PDU, 'fetchFromCMS').mockResolvedValueOnce(twelveArticles());

        render(<Component />);

        await waitFor(() =>
            expect(screen.getByRole('status')).toHaveTextContent('12 blog posts found')
        );
        jest.clearAllMocks();
    });
    it('moves focus to the first result on an explicit search', async () => {
        jest.spyOn(PDU, 'fetchFromCMS').mockResolvedValueOnce(twelveArticles());

        render(<Component entry="/blog/?q=education" />);

        await waitFor(
            () => expect(document.activeElement?.tagName).toBe('A')
        );
        jest.clearAllMocks();
    });
    it('does not steal focus when results come from facets, not a query', async () => {
        jest.spyOn(PDU, 'fetchFromCMS').mockResolvedValueOnce(twelveArticles());

        render(<Component entry="/blog/?subjects=Math" />);

        await screen.findAllByText('Read more');
        expect(document.activeElement?.tagName).not.toBe('A');
        jest.clearAllMocks();
    });
});

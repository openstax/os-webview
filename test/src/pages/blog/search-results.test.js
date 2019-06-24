import SearchResults from '~/pages/blog/search-results/search-results';

describe('search-results', () => {
    const p = new SearchResults();

    it('creates', () => {
        expect(p).toBeTruthy();
    });
});

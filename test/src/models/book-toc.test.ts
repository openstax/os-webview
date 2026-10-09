import bookToc from '~/models/book-toc';
import * as CF from '~/helpers/cms-fetch';
import * as RR from '~/models/rex-release';

const mockCmsFetch = jest.spyOn(CF, 'default');
const mockFetchRexRelease = jest.spyOn(RR, 'default');
const contents = [{title: 'Preface'}];

describe('models/book-toc', () => {
    beforeEach(() => {
        mockCmsFetch.mockResolvedValue({
            webview_rex_link: 'https://example.com/books/x', // eslint-disable-line camelcase
            cnx_id: 'cnx-id' // eslint-disable-line camelcase
        });
    });
    it('memoizes successful results', async () => {
        mockFetchRexRelease.mockResolvedValueOnce({tree: {contents}});
        expect(await bookToc('memo-book')).toEqual(contents);
        expect(await bookToc('memo-book')).toEqual(contents);
        expect(mockFetchRexRelease).toHaveBeenCalledTimes(1);
    });
    it('retries after a failure instead of caching the rejection', async () => {
        mockFetchRexRelease.mockReset();
        mockFetchRexRelease.mockRejectedValueOnce(new Error('Load failed'));
        await expect(bookToc('retry-book')).rejects.toThrow('Load failed');

        mockFetchRexRelease.mockResolvedValueOnce({tree: {contents}});
        expect(await bookToc('retry-book')).toEqual(contents);
        expect(mockFetchRexRelease).toHaveBeenCalledTimes(2);
    });
});

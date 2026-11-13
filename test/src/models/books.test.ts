import {describe, it, expect} from '@jest/globals';

// The module also starts the fetchAllBooks request, which wants `items`
function cmsResponse(books: unknown[]) {
    return (path: string): Promise<unknown> =>
        Promise.resolve(path === 'books?format=json' ? {books} : {items: []});
}

describe('models/books', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('fetches the book list on first use, not at import', async () => {
        const books = [
            {slug: 'live-book', 'book_state': 'live'},
            {slug: 'old-book', 'book_state': 'retired'}
        ];
        const cmsFetch = jest.fn(cmsResponse(books));

        jest.doMock('~/helpers/cms-fetch', () => ({
            __esModule: true,
            default: cmsFetch
        }));

        const {default: fetchBooks} = await import('~/models/books');

        expect(cmsFetch).not.toHaveBeenCalledWith('books?format=json');
        await expect(fetchBooks()).resolves.toEqual([books[0]]);
        await expect(fetchBooks()).resolves.toEqual([books[0]]);
        expect(
            cmsFetch.mock.calls.filter(([path]) => path === 'books?format=json')
        ).toHaveLength(1);
    });

    it('fetches again after the cached lookup rejects', async () => {
        const cmsFetch = jest.fn((path: string): Promise<unknown> =>
            path === 'books?format=json'
                ? Promise.reject(new Error('temporary failure'))
                : Promise.resolve({items: []})
        );

        jest.doMock('~/helpers/cms-fetch', () => ({
            __esModule: true,
            default: cmsFetch
        }));

        const {default: fetchBooks} = await import('~/models/books');

        await expect(fetchBooks()).rejects.toThrow('temporary failure');
        cmsFetch.mockImplementation(cmsResponse([]));
        await expect(fetchBooks()).resolves.toEqual([]);
    });
});

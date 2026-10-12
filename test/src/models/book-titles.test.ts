describe('book-titles', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('retries after the cached book lookup rejects', async () => {
        const book = {
            id: 1,
            'book_state': 'live',
            title: 'Book Title',
            'promote_snippet': [],
            meta: {
                slug: 'originalslug',
                'detail_url': 'https://openstax.org/details/books/originalslug/'
            }
        };
        const cmsFetch = jest.fn()
            .mockRejectedValueOnce(new Error('temporary failure'))
            .mockResolvedValueOnce({items: [book]});

        jest.doMock('~/helpers/cms-fetch', () => ({
            __esModule: true,
            default: cmsFetch
        }));

        const BookTitles = await import('~/models/book-titles');

        await expect(BookTitles.default).rejects.toThrow('temporary failure');
        await expect(BookTitles.getBookTitles()).resolves.toEqual([book]);
        await expect(BookTitles.getBookTitles()).resolves.toEqual([book]);
        expect(cmsFetch).toHaveBeenNthCalledWith(
            1,
            'pages/?type=books.Book&fields=title,id,book_state,promote_snippet&limit=250'
        );
        expect(cmsFetch).toHaveBeenCalledTimes(2);
    });
});

import Article from '~/pages/blog/article/article';

describe('article', () => {
    const p = new Article({
        slug: '/blog-article/whatever'
    });

    it('creates', () => {
        expect(p).toBeTruthy();
    });
});

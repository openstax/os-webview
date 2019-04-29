import FormattedAs from '~/pages/blog/article/formatted-as/formatted-as';
import articleData from '../../data/blog-article';

articleData.slug = 'test-article-slug';

describe('blog/FormattedAs', () => {
    it('displays as feature', () => {
        const p = new FormattedAs('feature', articleData);

        expect(p).toBeTruthy();
        expect(p.el.textContent.length).toBe(5229);
    });
    it('displays as synopsis', () => {
        const p = new FormattedAs('synopsis', articleData);

        expect(p).toBeTruthy();
        expect(p.el.textContent.length).toBe(620);
    });
});

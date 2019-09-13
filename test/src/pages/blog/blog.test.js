import Blog from '~/pages/blog/blog';
import instanceReady from '../../../helpers/instance-ready';

describe('blog', () => {
    const {instance: p, ready} = instanceReady(Blog);

    it('loads articles', () =>
        ready.then(() => {
            expect(p).toBeTruthy();
            expect(Reflect.ownKeys(p.articles).length).toBe(93);
        })
    );
    it('displays summary cards', () => {
        const card = p.el.querySelector('.card');

        expect(card.querySelector('.link-image').href.length).toBeGreaterThan(10);
    });
    it('displays the pinned article', () => {
        const pa = p.el.querySelector('.pinned-article');

        expect(pa).toBeTruthy();
        expect(pa.querySelector('.article-blurb')).toBeTruthy();
        expect(pa.querySelector('.no-such-thing')).toBeFalsy();
    });
});

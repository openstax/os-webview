import 'babel-polyfill';
import "~/../../test/system.src";
import "~/main";
import Blog from '~/pages/blog/blog';

describe('Blog', () => {
    it ('can instantiate page', () => {
        const p = new Blog();
    });
    test('has two classes', () => {
        const p = new Blog();

        expect(p.el.classList.length).toBe(2);
    });
});

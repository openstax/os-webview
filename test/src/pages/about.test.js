import 'babel-polyfill';
import "~/../../test/system.src";
import "~/main";
import AboutUs from '~/pages/about/about';

describe('AboutUs', () => {
    it ('can instantiate page', () => {
        const p = new AboutUs();
    });
    test('has three classes', () => {
        const p = new AboutUs();

        expect(p.el.classList.length).toBe(3);
    });
});

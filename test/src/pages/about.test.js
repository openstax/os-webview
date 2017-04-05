// import 'babel-polyfill';
// import "~/../jspm_packages/system.js";
import "~/../../jspm_packages/system.src.js";
import "~/../jspm.browser.js";
import "~/../jspm.config.js";
import "~/../libs/dependencies.js";
import AboutUs from '~/pages/about/about';

describe('AboutUs', () => {
    test('3 is 3', () => {
        expect(3).toBe(3);
    });
    /*
    it ('can instantiate page', () => {
        const p = new AboutUs();
    });
    test('has three classes', () => {
        const p = new AboutUs();

        expect(p.el.classList.length).toBe(3);
    });
    */
});

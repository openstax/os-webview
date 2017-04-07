import 'babel-polyfill';
import "~/../../test/system.src";
import "~/main";
import Subjects from '~/pages/subjects/subjects';

describe('Subjects', () => {
    it ('can instantiate page', () => {
        const p = new Subjects();
    });
    test('has two classes', () => {
        const p = new Subjects();

        expect(p.el.classList.length).toBe(2);
    });
});

import Technology from '~/pages/technology/technology';
import {clickElement} from '../../test-utils';

describe('Technology', () => {
    const p = new Technology();

    it('creates', () => {
        expect(p).toBeTruthy();
    });

    it('lets you choose a book', () => {
        const bookChooser = p.el.querySelector('book-selector .form-select .proxy-select');

        expect(bookChooser).toBeTruthy();

        const options = bookChooser.querySelector('ul.options');

        expect(Array.from(options.classList)).not.toContain('open');
        clickElement(bookChooser);
        expect(Array.from(options.classList)).toContain('open');

        const biologyOption = options.querySelector('.option[data-value="biology"]');
        const selectedItem = bookChooser.querySelector('.item');

        expect(biologyOption).toBeTruthy();
        expect(selectedItem.textContent).toBe('Choose your book');
        clickElement(biologyOption);
    });
    it('eventually says Biology', () => {
        const selectedItem = p.el.querySelector('book-selector .form-select .proxy-select .item');

        expect(selectedItem.textContent).toBe('Biology');
    });
});

import SearchBar from '~/pages/blog/search-bar/search-bar';
import {clickElement, doInput, doKeyPress} from '../../../test-utils';

describe('search-bar', () => {
    const p = new SearchBar();
    const inputEl = p.el.querySelector('[name="search-input"]');

    it('creates', () => {
        expect(p).toBeTruthy();
    });
    it('accepts input', () => {
        doInput(inputEl, 'education');
        return new Promise((resolve) => {
            p.on('value', (newValue) => {
                expect(newValue).toBe('education');
                resolve(newValue);
            });
            clickElement(p.el.querySelector('button'));
        });
    });
    it('clears input', () => {
        const clearEl = p.el.querySelector('.clear-search');

        clickElement(clearEl);
        expect(p.el.querySelector('[name="search-input"]').value).toBe('');
        doInput(inputEl, 'something');
        expect(p.el.querySelector('[name="search-input"]').value).toBe('something');
        doKeyPress(clearEl, ' ');
        expect(p.el.querySelector('[name="search-input"]').value).toBe('');

    });
});

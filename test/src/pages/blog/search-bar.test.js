import SearchBar from '~/pages/blog/search-bar/search-bar';
import {clickElement} from '../../../test-utils';

describe('search-bar', () => {
    const p = new SearchBar({
        model: {
            title: 'Search Bar title'
        }
    });

    it('creates', () => {
        expect(p).toBeTruthy();
        expect(p.el.querySelector('h2').textContent).toBe('Search Bar title');
    });
    it('accepts input', () => {
        p.el.querySelector('[name="search-input"]').value = 'education';
        return new Promise((resolve) => {
            p.on('value', (newValue) => {
                expect(newValue).toBe('education');
                resolve(newValue);
            });
            clickElement(p.el.querySelector('button'));
        });
    });
});

import CategorySelector from '~/components/category-selector/category-selector';
import {clickElement} from '../../test-utils';
import $ from '~/helpers/$';

describe('CategorySelector', () => {
    const categories = CategorySelector.categories;
    const p = new CategorySelector();

    ['Math', 'Science', 'Social Sciences', 'Humanities', 'Business']
        .forEach((name) => {
            categories.push({
                value: name.toLowerCase().replace(' ', '-'),
                cms: name,
                html: name
            });
        });
    categories.push({value: 'ap', cms: 'AP', html: 'AP<sup>&reg;</sup>'});
    for (const c of categories) {
        CategorySelector.byValue[c.value] = c;
    }
    p.update();

    it('creates', () => {
        expect(p.el.innerHTML).toBeTruthy();
    });
    it('handles math click', () => {
        const mathButton = p.el.querySelector('[data-value="math"]');

        clickElement(mathButton);
        expect(mathButton.getAttribute('aria-pressed')).toBe('true');
        expect(p.model().isSelected('math')).toBe(true);
    });
    it('handles selection by key enter', () => {
        const scienceButton = p.el.querySelector('[data-value="science"]');

        scienceButton.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Enter',
                code: $.key.enter,
                keyCode: $.key.enter,
                bubbles: true,
                cancelable: true
            })
        );
        expect(p.model().isSelected('science')).toBe(true);
    });
    it('matches snapshot', () => {
        console.log('To update snapshot: node_modules/.bin/jest --updateSnapshot --testNamePattern=CategorySelector');
        expect(p.el.innerHTML).toMatchSnapshot();
    });
});

import CategorySelector from '~/components/category-selector/category-selector';

describe('CategorySelector', () => {
    const p = new CategorySelector();

    it('matches snapshot', () => {
        expect(p.el.outerHTML).toMatchSnapshot();
    });
    it('puts the categories in the buttons', () => {
        const buttons = p.el.querySelectorAll('.filter-button');

        expect(buttons.length).toBeGreaterThan(1);
        buttons.forEach((b, i) => {
            expect(b.textContent).toBe(CategorySelector.categories[i].html);
        })
    });
});

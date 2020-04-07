import CategorySelector from '~/components/category-selector/category-selector';

describe('CategorySelector', () => {
    const p = new CategorySelector();

    it('loads the categories', () => {
        return CategorySelector.loaded.then(() => {
            expect(CategorySelector.categories).toMatchSnapshot();
        });
    });
});

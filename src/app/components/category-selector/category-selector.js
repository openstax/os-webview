import RadioPanel from '~/components/radio-panel/radio-panel';
import categoryPromise from '~/models/subjectCategories';
import {Controller} from 'superb.js';

export default class CategorySelector extends RadioPanel {

    static categories = [];
    static byValue = {};
    static loaded = categoryPromise.then((categories) => {
        CategorySelector.categories.push(...categories);
        Object.assign(CategorySelector.byValue, categories.byValue);
    });

    init() {
        super.init(CategorySelector.categories);
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        CategorySelector.loaded.then(() => {
            this.updateProps({items: CategorySelector.categories});
        });
    }

}

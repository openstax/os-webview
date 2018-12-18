import RadioPanel from '~/components/radio-panel/radio-panel';
import settings from 'settings';
import categoryPromise from '~/models/subjectCategories';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';

export default class CategorySelector extends RadioPanel {

    static categories = [];
    static byValue = {};
    static loaded = categoryPromise.then((categories) => {
        CategorySelector.categories.push(...categories);
        Object.assign(CategorySelector.byValue, categories.byValue);
    });

    init(setState) {
        super.init(CategorySelector.categories, setState);
    }

    onLoaded() {
        CategorySelector.loaded.then(() => {
            this.items = CategorySelector.categories;
            this.update();
        });
    }

}

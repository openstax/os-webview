import {Controller} from 'superb';
import router from '~/router';
import FilterButton from './filter-button';

const categories = [
    {slug: 'view-all', cms: '', html: 'View All'},
    {slug: 'math', cms: 'Math', html: 'Math'},
    {slug: 'science', cms: 'Science', html: 'Science'},
    {slug: 'social-sciences', cms: 'Social Sciences', html: 'Social Sciences'},
    {slug: 'humanities', cms: 'Humanities', html: 'Humanities'},
    {slug: 'ap', cms: 'AP', html: 'AP<sup>&reg;</sup>'}
];

const bySlug = {};
const byCms = {};

for (const c of categories) {
    bySlug[c.slug] = c;
    byCms[c.cms] = c;
}

export default class CategorySelector extends Controller {

    static categories = categories;
    static bySlug = bySlug;
    static byCms = byCms;

    init(setState) {
        this.template = () => '';
        this.view = {
            classes: ['filter-buttons']
        };

        this.buttonViews = categories.map((button) =>
            new FilterButton(button.html, button.cms, (category) => {
                this.updateSelected(category);
                setState(category);
            })
        );
    }

    updateSelected(category) {
        for (const view of this.buttonViews) {
            if (category === view.value) {
                view.el.classList.add('selected');
            } else {
                view.el.classList.remove('selected');
            }
        }
    }

    onLoaded() {
        for (const view of this.buttonViews) {
            this.regions.self.append(view);
        }
    }

}

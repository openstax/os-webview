import {Controller} from 'superb';
// import FilterButton from './filter-button';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './category-selector.html';

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
        this.template = template;
        this.view = {
            classes: ['filter-buttons']
        };
        this.model = {
            categories,
            isSelected: (cms) => this.selectedCms === cms ? ' selected' : ''
        };
        this.setState = setState;
        this.active = false;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

    updateSelected(category) {
        this.selectedCms = category;
        this.update();
    }

    @on('click')
    toggleActive() {
        this.active = !this.active;
        this.el.classList.toggle('active', this.active);
    }

    @on('click .filter-button')
    setCategory(event) {
        const newValue = event.target.dataset.value;

        if (newValue !== this.selectedCms) {
            this.active = false;
            this.el.classList.remove('active');
        }
        this.updateSelected(newValue);
        this.setState(newValue);
    }

}

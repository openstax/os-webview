import router from '~/router';
import CMSPageController from '~/controllers/cms';
import BookViewer from './book-viewer/book-viewer';
import CategorySelector from '~/components/category-selector/category-selector';
import {description as template} from './subjects.html';

export default class Subjects extends CMSPageController {

    static description = `Our textbooks are openly licensed, peer-reviewed,
       free, and backed by learning resources. Check out our books and
       decide if they're right for your course.`;

    init() {
        this.template = template;
        this.css = '/app/pages/subjects/subjects.css';
        this.view = {
            classes: ['subjects-page']
        };
        this.regions = {
            filter: '.filter',
            bookViewer: '.books .container'
        };
        this.model = {};
        this.queryPage = {
            title: 'Subjects'
        };
        this.bookViewer = new BookViewer();
        this.categorySelector = new CategorySelector((category) => this.filterCategories(category));

        this.filterCategoriesEvent = () => {
            this.bookViewer.filterCategories(history.state.filter);
            this.categorySelector.updateSelected(history.state.filter);
        }
        window.addEventListener('popstate', this.filterCategoriesEvent);
    }

    filterCategories(category) {
        const slug = CategorySelector.byCms[category].slug;
        const path = slug === 'view-all' ? '/subjects' : `/subjects/${slug}`;

        router.navigate(path, {filter: category, path: '/subjects'}, {ignore: true});
        this.bookViewer.filterCategories(category);
    }

    onLoaded() {
        this.regions.filter.attach(this.categorySelector);
        this.regions.bookViewer.attach(this.bookViewer);

        const slug = decodeURIComponent(window.location.pathname).replace(/.*subjects/, '').substr(1) || 'view-all';
        const category = CategorySelector.bySlug[slug];

        if (!category) {
            return;
        }
        this.categorySelector.updateSelected(category.cms);
    }

    onDataLoaded() {
        document.title = `${this.pageData.title} - OpenStax`;
        this.model = this.pageData;
        this.update();
        for(const htmlEl of this.el.querySelectorAll('[data-html]')) {
            htmlEl.innerHTML = this.model[htmlEl.dataset.html];
        }
    }

    onClose() {
        window.removeEventListener('popstate', this.filterCategoriesEvent);
    }

}

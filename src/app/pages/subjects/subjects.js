import router from '~/router';
import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
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

        router.replaceState({
            filter: this.categoryFromPath(),
            path: '/subjects'
        });
        this.filterCategoriesEvent = () => {
            const category = history.state.filter;

            this.bookViewer.filterCategories(category);
            this.categorySelector.updateSelected(category);
        };
        window.addEventListener('popstate', this.filterCategoriesEvent);
    }

    categoryFromPath() {
        const slug = window.location.pathname.replace(/.*subjects/, '').substr(1).toLowerCase() || 'view-all';

        return CategorySelector.bySlug[slug].cms;
    }

    filterCategories(category) {
        const slug = CategorySelector.byCms[category].slug;
        const path = slug === 'view-all' ? '/subjects' : `/subjects/${slug}`;

        router.navigate(path, {
            filter: category,
            path: '/subjects',
            x: history.state.x,
            y: history.state.y
        });
        this.bookViewer.filterCategories(category);
    }

    onLoaded() {
        this.regions.filter.attach(this.categorySelector);
        this.regions.bookViewer.attach(this.bookViewer);
        const category = this.categoryFromPath();

        this.categorySelector.updateSelected(category);
        this.filterCategories(category);
    }

    onDataLoaded() {
        document.title = `${this.pageData.title} - OpenStax`;
        this.model = this.pageData;
        for (const htmlEl of this.el.querySelectorAll('[data-html]')) {
            htmlEl.innerHTML = this.model[htmlEl.dataset.html];
        }
        this.update();
    }

    onClose() {
        window.removeEventListener('popstate', this.filterCategoriesEvent);
    }

    @on('click', '.filter .filter-button')
    scrollToFilterButtons() {
        $.scrollTo(this.el.querySelector('.filter'));
    }
}

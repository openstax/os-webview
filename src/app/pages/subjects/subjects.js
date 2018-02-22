import router from '~/router';
import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import BookViewer from './book-viewer/book-viewer';
import CategorySelector from '~/components/category-selector/category-selector';
import {description as template} from './subjects.html';

const pagePath = '/subjects';

export default class Subjects extends CMSPageController {

    static description = 'Our textbooks are openly licensed, peer-reviewed,' +
        'free, and backed by learning resources. Check out our books and' +
        'decide if they\'re right for your course.';

    init() {
        this.slug = 'books';
        this.template = template;
        this.css = '/app/pages/subjects/subjects.css?v2.6.0';
        this.view = {
            classes: ['subjects-page', 'hide-until-loaded']
        };
        this.regions = {
            filter: '.filter',
            bookViewer: '.books .container'
        };
        this.model = {};
        this.categorySelector = new CategorySelector((category) => this.filterSubjects(category));

        shell.showLoader();

        router.replaceState({
            filter: this.categoryFromPath(),
            path: pagePath
        });
        this.filterSubjectsEvent = () => {
            const category = history.state.filter;

            this.categorySelector.updateSelected(category);
            this.bookViewer.filterSubjects(category);
        };
        window.addEventListener('popstate', this.filterSubjectsEvent);
    }

    categoryFromPath() {
        return window.location.pathname.replace(/.*subjects/, '').substr(1).toLowerCase() || 'view-all';
    }

    filterSubjects(category) {
        const path = category === 'view-all' ? pagePath : `${pagePath}/${category}`;

        this.bookViewer.filterSubjects(category);

        const yTarget = history.state.y;

        router.navigate(path, {
            filter: category,
            path: pagePath
        });
        window.scrollTo(0, yTarget);
    }

    onDataLoaded() {
        document.title = `${this.pageData.title} - OpenStax`;
        Object.assign(this.model, this.pageData);
        this.update();
        $.insertHtml(this.el, this.model);
        this.bookViewer = new BookViewer(this.model.books);
        this.regions.bookViewer.attach(this.bookViewer);
        this.regions.filter.attach(this.categorySelector);
        const category = this.categoryFromPath();

        this.categorySelector.updateSelected(category);
        this.filterSubjects(category);
        this.el.classList.add('loaded');
        shell.hideLoader();
    }

    onLoaded() {
        const threshold = 347;

        this.setFilterClass = () => {
            const newStickyState = window.pageYOffset > threshold;

            if (newStickyState !== this.model.filterIsSticky) {
                this.model.filterIsSticky = newStickyState;
                this.update();
            }
        };
        window.addEventListener('scroll', this.setFilterClass, false);
        document.getElementById('main').classList.add('subjects-main');
    }

    onClose() {
        window.removeEventListener('popstate', this.filterSubjectsEvent);
        window.removeEventListener('scroll', this.setFilterClass, false);
        document.getElementById('main').classList.remove('subjects-main');
    }

}

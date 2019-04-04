import routerBus from '~/helpers/router-bus';
import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import BookViewer from './book-viewer/book-viewer';
import CategorySelector from '~/components/category-selector/category-selector';
import {description as template} from './subjects.html';
import css from './subjects.css';
import $ from '~/helpers/$';

const pagePath = '/subjects';
const spec = {
    template,
    css,
    slug: 'books',
    view: {
        classes: ['subjects-page', 'hide-until-loaded'],
        tag: 'main'
    },
    regions: {
        filter: '.filter',
        bookViewer: '.books .container'
    },
    model: {}
};
const BaseClass = componentType(spec, canonicalLinkMixin, loaderMixin);

export default class Subjects extends BaseClass {

    init() {
        super.init();
        this.categorySelector = new CategorySelector();
        this.categorySelector.on('change', (category) => {
            this.filterSubjects(category);
        });
        routerBus.emit('replaceState', {
            filter: this.categoryFromPath(),
            path: pagePath
        });
    }

    categoryFromPath() {
        return window.location.pathname.replace(/.*subjects/, '').substr(1).toLowerCase() || 'view-all';
    }

    filterSubjects(category) {
        const path = category === 'view-all' ? pagePath : `${pagePath}/${category}`;

        this.bookViewer.filterSubjects(category);

        const yTarget = history.state.y;

        routerBus.emit('navigate', path, {
            filter: category,
            path: pagePath
        });
        window.scrollTo(0, yTarget);
        this.setCanonicalLink();
        this.setTitle(category);
    }

    setTitle(category) {
        const categoryEntry = CategorySelector.categories.find((e) => e.value === category);
        const title = (categoryEntry && 'title' in categoryEntry) ? categoryEntry.title : this.pageData.title;

        $.setPageTitleAndDescription(title, this.pageData.page_description);
    }

    onDataLoaded() {
        Object.assign(this.model, this.pageData);
        this.update();
        this.insertHtml();
        this.bookViewer = new BookViewer(this.model.books);
        this.regions.bookViewer.attach(this.bookViewer);
        this.filterSubjectsEvent = () => {
            const category = history.state.filter;

            this.categorySelector.updateSelected(category);
            this.bookViewer.filterSubjects(category);
        };
        window.addEventListener('popstate', this.filterSubjectsEvent);
        this.regions.filter.attach(this.categorySelector);
        const category = this.categoryFromPath();

        this.categorySelector.updateSelected(category);
        this.filterSubjects(category);
        this.el.classList.add('loaded');
        this.hideLoader();
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
        super.onClose();
        window.removeEventListener('popstate', this.filterSubjectsEvent);
        window.removeEventListener('scroll', this.setFilterClass, false);
        document.getElementById('main').classList.remove('subjects-main');
    }

}

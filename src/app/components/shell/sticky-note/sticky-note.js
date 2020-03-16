import $ from '~/helpers/$';
import CMSPageController from '~/controllers/cms';
import routerBus from '~/helpers/router-bus';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './sticky-note.html';
import css from './sticky-note.css';

const isExpired = (str) => Boolean(str && (new Date(str) < Date.now()));

class StickyNote extends CMSPageController {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['sticky-note']
        };
        this.slug = 'sticky';
        this.model = () => this.getModel();
        this.temporary = false;
        this.content = '';
        this.expired = false;
        this.expires = '';
    }

    getModel() {
        return {
            temporary: this.temporary,
            content: this.content,
            expires: this.expires
        };
    }

    onDataLoaded() {
        this.expires = this.pageData.expires;
        if (this.pageData.emergency_content && !isExpired(this.pageData.emergency_expires)) {
            this.temporary = true;
            this.expired = false;
            this.content = this.pageData.emergency_content;
            this.el.classList.add('temporary-banner');
            this.forceHide(false);
        } else {
            this.content = this.pageData.content;
            this.expired = isExpired(this.pageData.expires);
        }
        this.hideOrUpdate();
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

    hideOrUpdate() {
        if (this.expired) {
            this.forceHide(true);
        } else {
            this.update();
        }
    }

    incrementVisitedGive() {
        // Safari private window patch
        try {
            localStorage.visitedGive = Number(localStorage.visitedGive || 0) + 1;
        } catch (e) {}
    }

    // Header calls this every time the URL changes.
    forceHide(whether) {
        this.el.classList.toggle('hidden', whether);
        if (!whether) {
            this.incrementVisitedGive();
            this.expired = !this.temporary &&
                (this.expired || Number(localStorage.visitedGive || 0) > 5);
            this.hideOrUpdate();
        }
    }

    @on('click .multi-button > [data-amount]')
    goToForm(e) {
        const amount = e.target.dataset.amount;

        e.preventDefault();
        routerBus.emit('navigate', '/give/form', {
            path: '/give',
            page: 2,
            amount
        });
    }

    @on('click .put-away')
    putAway(e) {
        this.forceHide(true);
        e.stopPropagation();
    }

}

const instance = new StickyNote();

export default instance;

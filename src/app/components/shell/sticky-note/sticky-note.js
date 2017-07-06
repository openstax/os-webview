import CMSPageController from '~/controllers/cms';
import router from '~/router';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './sticky-note.html';

const isExpired = (str) => new Date(str) < Date.now();

class StickyNote extends CMSPageController {

    init() {
        this.template = template;
        this.css = '/app/components/shell/sticky-note/sticky-note.css';
        this.view = {
            classes: ['sticky-note']
        };
        this.slug = 'sticky';
        this.model = {};
    }

    onDataLoaded() {
        this.expired = true;
        if (this.pageData.emergency_content && !isExpired(this.pageData.emergency_expires)) {
            this.model.temporary = true;
            this.model.content = this.pageData.emergency_content;
            this.el.classList.add('temporary-banner');
            this.expired = false;
        } else if (isExpired(this.pageData.expires)) {
            this.forceHide(true);
            localStorage.removeItem('visitedGive');
        }
        this.onLoaded();
        this.update();
    }

    onLoaded() {
        const expiredNow = !this.model.temporary && Number(localStorage.visitedGive || 0) > 5;

        if (expiredNow !== this.expired) {
            this.expired = expiredNow;
            this.model.content = this.pageData && !this.expired && this.pageData.content;
            this.update();
        }
    }

    forceHide(whether) {
        this.el.classList.toggle('hidden', whether || this.model.content === null);
        if (!whether) {
            this.onLoaded();
        }
    }

    @on('click .multi-button > a')
    goToForm(e) {
        const amount = e.target.dataset.amount;

        e.preventDefault();
        router.navigate('/give/form', {
            path: '/give',
            page: 2,
            amount
        });
    }

}

const instance = new StickyNote();

export default instance;

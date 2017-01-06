import CMSPageController from '~/controllers/cms';
import router from '~/router';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './sticky-note.html';

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
        const isExpired = (str) => new Date(str) < Date.now();

        this.expired = true;
        if (this.pageData.emergency_content && !isExpired(this.pageData.emergency_expires)) {
            this.model.temporary = true;
            this.model.content = this.pageData.emergency_content;
            this.el.classList.add('temporary-banner');
            this.expired = false;
        } else {
            if (isExpired(this.pageData.expires)) {
                this.forceHide(true);
                localStorage.removeItem('visitedGive');
            } else {
                this.expired = Number(localStorage.visitedGive || 0) > 5;
            }
            this.model.content = this.expired ? null : this.pageData.content;
        }
        this.update();
    }

    forceHide(whether) {
        this.el.classList.toggle('hidden', whether);
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

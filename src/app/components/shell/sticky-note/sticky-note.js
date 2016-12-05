import CMSPageController from '~/controllers/cms';
import router from '~/router';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './sticky-note.html';

const TEMPORARY_EXPIRATION = new Date('Dec 10 2016 12:00 CST');

class StickyNote extends CMSPageController {

    init() {
        const isTemporary = Date.now() < TEMPORARY_EXPIRATION;

        this.template = template;
        this.css = '/app/components/shell/sticky-note/sticky-note.css';
        this.view = {
            classes: ['sticky-note']
        };
        if (isTemporary) {
            this.view.classes.push('temporary-banner');
        }
        this.slug = 'sticky';
        this.model = {
            temporary: isTemporary
        };
    }

    onDataLoaded() {
        const expired = !this.model.temporary && new Date(this.pageData.expires) < Date.now();

        if (expired) {
            this.el.classList.add('hidden');
            localStorage.removeItem('visitedGive');
        }
        this.model.content = this.pageData.content;
        this.update();
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

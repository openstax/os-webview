import CMSPageController from '~/controllers/cms';
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
        const expired = new Date(this.pageData.expires) < Date.now();

        if (expired) {
            this.el.classList.add('hidden');
            localStorage.removeItem('visitedGive');
        }
        this.model.content = this.pageData.content;
        this.update();
    }

}

const instance = new StickyNote();

export default instance;

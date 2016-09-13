import {Controller} from 'superb';
import {description as template} from './sticky-note.html';

class StickyNote extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/shell/sticky-note/sticky-note.css';
        this.view = {
            classes: ['sticky-note']
        };
    }

}

const instance = new StickyNote();

export default instance;

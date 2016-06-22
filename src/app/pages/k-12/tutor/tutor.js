import {Controller} from 'superb';
import {description as template} from './tutor.html';

// FIX: Does this warrant its own view?
export default class Tutor extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/k-12/tutor/tutor.css';
        this.view = {
            classes: ['tutor']
        };
    }

}

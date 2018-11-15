import {Controller} from 'superb.js';
import {description as template} from './inquiries.html';
import css from './inquiries.css';

export default class Inquiries extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['inquiries']
        };
        this.css = css;
    }

}

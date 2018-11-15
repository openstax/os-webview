import {Controller} from 'superb.js';
import {description as template} from './loading-section.html';
import css from './loading-section.css';

export default class LoadingSection extends Controller {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['os-loader']
        };
    }

}

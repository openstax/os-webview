import {Controller} from 'superb.js';
import {description as template} from './header-1.html';
import css from './header-1.css';

export default class Header1 extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['header-1']
        };
        this.css = css;
    }

}

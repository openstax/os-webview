import {Controller} from 'superb.js';
import {description as template} from './header-2.html';

export default class Header2 extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['header-2']
        };
    }

}

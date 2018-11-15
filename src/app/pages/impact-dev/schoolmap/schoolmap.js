import {Controller} from 'superb.js';
import {description as template} from './schoolmap.html';
import css from './schoolmap.css';

export default class Schoolmap extends Controller {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['schoolmapbox']
        };
    }

}

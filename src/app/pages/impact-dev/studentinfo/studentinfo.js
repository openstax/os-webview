import {Controller} from 'superb.js';
import {description as template} from './studentinfo.html';
import css from './studentinfo.css';

export default class Studentinfo extends Controller {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['studentinfobox']
        };
    }

}

import {Controller} from 'superb.js';
import {description as template} from './alumni-tab.html';
import css from './alumni-tab.css';

export default class AlumniTab extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['alumni-tab']
        };
        this.css = css;
    }

}

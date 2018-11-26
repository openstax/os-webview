import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './partners-tab.html';
import css from './partners-tab.css';

export default class PartnersTab extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.css = css;
        this.view = {
            classes: ['partners-tab']
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './education.html';

export default class Education extends Controller {

    init(model) {
        this.template = template;
        this.css = '/app/pages/home/education/education.css?v2.6.0';
        this.model = {
            main: model[0],
            block1: model[1],
            block2: model[2]
        };
        this.view = {
            classes: ['education-banner']
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

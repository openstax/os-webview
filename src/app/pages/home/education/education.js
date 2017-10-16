import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {render as template} from './education.html';

export default class Education extends Controller {

    init(model) {
        this.template = template;
        this.css = '/app/pages/home/education/education.css';
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

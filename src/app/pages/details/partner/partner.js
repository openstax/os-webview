import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './partner.html';

export default class Partner extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['partner-info']
        };
        this.regions = {
            logo: '.logo'
        };
        this.model = model;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

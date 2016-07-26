import {Controller} from 'superb';
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
        this.el.querySelector('blurb-html').innerHTML = this.model.blurb;
    }

}

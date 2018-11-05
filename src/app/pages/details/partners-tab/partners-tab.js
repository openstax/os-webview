import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './partners-tab.html';

export default class PartnersTab extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.css = `/app/pages/details/partners-tab/partners-tab.css?${VERSION}`;
        this.view = {
            classes: ['partners-tab']
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

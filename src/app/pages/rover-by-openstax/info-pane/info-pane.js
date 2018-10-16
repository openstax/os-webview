import VERSION from '~/version';
import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import {description as template} from './info-pane.html';

export default class InfoPane extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['info-pane']
        };
        this.css = `/app/pages/rover/info-pane/info-pane.css?${VERSION}`;
        this.model = model;
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}

import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './errata-pane.html';
import {description as templatePolish} from './errata-pane-polish.html';

export default class ErrataPane extends Controller {

    init(model) {
        this.model = model;
        this.template = $.isPolish(model.title) ? templatePolish : template;
        this.view = {
            classes: ['errata-pane']
        };
        this.css = `/app/pages/details/phone-view/errata-pane/errata-pane.css?${VERSION}`;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

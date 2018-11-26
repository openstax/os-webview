import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './errata-pane.html';
import {description as templatePolish} from './errata-pane-polish.html';
import css from './errata-pane.css';

export default class ErrataPane extends Controller {

    init(model) {
        this.model = model;
        this.template = $.isPolish(model.title) ? templatePolish : template;
        this.view = {
            classes: ['errata-pane']
        };
        this.css = css;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

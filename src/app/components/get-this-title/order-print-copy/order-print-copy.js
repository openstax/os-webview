import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {Controller} from 'superb.js';
import {description as template} from './order-print-copy.html';
import css from './order-print-copy.css';

export default class OrderPrintCopy extends Controller {

    init(model, onNavigate) {
        this.template = template;
        this.model = model;
        this.view = {
            tag: 'nav',
            classes: ['order-print-copy']
        };
        this.css = css;
        this.onNavigate = onNavigate;
    }

    @on('click [href]')
    closeAfterDelay() {
        window.requestAnimationFrame(() => {
            this.onNavigate();
        });
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

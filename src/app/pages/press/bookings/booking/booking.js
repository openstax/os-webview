import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './booking.html';
import css from './booking.css';

export default class Booking extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['booking']
        };
        this.css = css;
        this.model = model;
    }

    onUpdate() {
        if (super.onUpdate) {
            super.onUpdate();
        }
        $.insertHtml(this.el, this.model);
    }

}

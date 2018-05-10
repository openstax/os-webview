import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './booking.html';

export default class Booking extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['booking']
        };
        this.css = `/app/pages/press/booking/booking.css?${VERSION}`;
        this.model = model;
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}

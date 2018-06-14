import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './bookings.html';
import Booking from './booking/booking';

export default class bookingsRegion extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['bookings']
        };
        this.css = `/app/pages/press/bookings/bookings.css?${VERSION}`;
        this.regions = {
            'bookings': '[data-region="bookings"]'
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        this.model.bios.forEach((obj) => this.regions.bookings.append(new Booking(obj)));
    }

}

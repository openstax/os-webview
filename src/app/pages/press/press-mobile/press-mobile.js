import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import Releases from './releases/releases';
import Mentions from './mentions/mentions';
import Inquiries from '../inquiries/inquiries';
import Bookings from '../bookings/bookings';
import {description as template} from './press-mobile.html';
import css from './press-mobile.css';

export default class PressMobile extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['press-mobile']
        };
        this.regions = {
            'releases': '[data-region="releases"]',
            'mentions': '[data-region="mentions"]',
            'inquiries': '[data-region="inquiries"]',
            'booking': '[data-region="booking"]'
        };
        this.css = css;
        this.model = () => this.getModel();
    }

    onLoaded() {
        this.regions.releases.attach(new Releases(() => this.props.pageData));
        this.regions.mentions.attach(new Mentions(() => this.props.pageData));
        this.regions.inquiries.attach(new Inquiries({
            pressInquiries: this.props.pageData.pressInquiries,
            pressKitUrl: this.props.pageData.pressKitUrl
        }));
        this.regions.booking.attach(new Bookings(this.props.pageData.experts));
    }

    getModel() {
        this.props = this.getProps();

        return {
            selection: this.props.mobileSelection,
            hiddenUnless: (v) => $.booleanAttribute(v !== this.props.mobileSelection)
        };
    }

}

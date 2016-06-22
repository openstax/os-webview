import {Controller} from 'superb';
import {description as template} from './contact-thank-you.html';

export default class ContactThankYou extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/contact-thank-you/contact-thank-you.css';
        this.view = {
            classes: ['confirmation-page', 'page']
        };
    }

}

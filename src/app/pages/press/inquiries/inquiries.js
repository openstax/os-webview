import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './inquiries.html';

export default class Inquiries extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['inquiries']
        };
        this.css = `/app/pages/press/inquiries/inquiries.css?${VERSION}`;
    }

}

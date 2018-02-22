import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './errata-pane.html';

export default class ErrataPane extends Controller {

    init(model) {
        this.model = model;
        this.template = template;
        this.view = {
            classes: ['errata-pane']
        };
        this.css = `/app/pages/details-new/phone-view/errata-pane/errata-pane.css${VERSION}`;
    }

}

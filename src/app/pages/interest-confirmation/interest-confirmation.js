import {Controller} from 'superb';
import {description as template} from './interest-confirmation.html';

export default class InterestConfirmation extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/interest-confirmation/interest-confirmation.css';
        this.view = {
            classes: ['interest-confirmation-page', 'page']
        };
    }

}

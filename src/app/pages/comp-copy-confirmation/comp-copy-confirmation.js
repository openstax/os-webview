import {Controller} from 'superb';
import {description as template} from './comp-copy-confirmation.html';

export default class InterestConfirmation extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/comp-copy-confirmation/comp-copy-confirmation.css';
        this.view = {
            classes: ['confirmation-page']
        };
    }

}

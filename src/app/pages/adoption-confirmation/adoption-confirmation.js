import {Controller} from 'superb';
import {description as template} from './adoption-confirmation.html';

export default class AdoptionConfirmation extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/adoption-confirmation/adoption-confirmation.css';
        this.view = {
            classes: ['confirmation-page', 'page']
        };
    }

}

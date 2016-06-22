import {Controller} from 'superb';
import {description as template} from './faculty-confirmation.html';

export default class FacultyConfirmation extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/faculty-confirmation/faculty-confirmation.css';
        this.view = {
            classes: ['confirmation-page', 'page']
        };
    }

}

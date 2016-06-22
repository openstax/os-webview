import {Controller} from 'superb';
import {description as template} from './accessibility-statement.html';

export default class Accessibility extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/accessibility-statement/accessibility-statement.css';
        this.view = {
            classes: ['accessibility-page', 'page']
        };
    }

}

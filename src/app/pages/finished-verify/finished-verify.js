import {Controller} from 'superb';
import {description as template} from './finished-verify.html';

export default class FinishedVerify extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/finished-verify/finished-verify.css';
        this.view = {
            classes: ['confirmation-page']
        };
    }

}

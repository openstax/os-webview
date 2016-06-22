import {Controller} from 'superb';
import {description as template} from './finished-no-verify.html';

export default class FinishedNoVerify extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/finished-no-verify/finished-no-verify.css';
        this.view = {
            classes: ['confirmation-page']
        };
    }

}

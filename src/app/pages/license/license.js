import {Controller} from 'superb';
import {description as template} from './license.html';

export default class License extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/license/license.css';
        this.view = {
            classes: ['license-page', 'page']
        };
    }

}

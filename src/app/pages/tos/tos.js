import {Controller} from 'superb';
import {description as template} from './tos.html';

export default class Tos extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/tos/tos.css';
        this.view = {
            classes: ['tos-page', 'page']
        };
    }

}

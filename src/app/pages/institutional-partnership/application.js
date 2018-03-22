import {Controller} from 'superb.js';
import {description as template} from './application.html';

export default class Application extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['application']
        };
    }

}

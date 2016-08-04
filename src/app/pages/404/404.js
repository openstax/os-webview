import {Controller} from 'superb';
import {description as template} from './404.html';

export default class NotFound extends Controller {

    init() {
        this.template = template;
        this.view = {
            tag: 'main',
            classes: ['not-found', 'no-style', 'page']
        };
    }

}

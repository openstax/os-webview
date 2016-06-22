import {Controller} from 'superb';
import {description as template} from './already-using.html';

export default class AlreadyUsing extends Controller {

    init() {
        this.template = template;
    }

}

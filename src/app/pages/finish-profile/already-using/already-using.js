import {Controller} from 'superb';
import selectHandler from '~/handlers/select';
import {description as template} from './already-using.html';

export default class AlreadyUsing extends Controller {

    init() {
        this.template = template;
    }

    onLoaded() {
        selectHandler.setup(this.el);
    }

}

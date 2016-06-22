import {Controller} from 'superb';
import {description as template} from './hero.html';

// FIX: Does this warrant its own view?
export default class Hero extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/k-12/hero/hero.css';
    }

}

import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import {description as template} from './let-us-know.html';
import {description as templatePolish} from './let-us-know-polish.html';
import css from './let-us-know.css';

export default class LetUsKnow extends Controller {

    init(getProps) {
        this.model = getProps();
        this.template = $.isPolish(this.model.title) ? templatePolish : template;
        this.view = {
            classes: ['let-us-know']
        };
        this.css = css;
    }

}

import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {description as template} from './comp-copy.html';

export default class CompCopyForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/comp-copy/comp-copy.css';
        this.view = {
            classes: ['comp-copy-form']
        };
        // NOTE: List of books is more limited than the published list in models/book-titles,
        // so using a hard-coded list in the HTML
    }

    onLoaded() {
        selectHandler.setup(this);
    }

}

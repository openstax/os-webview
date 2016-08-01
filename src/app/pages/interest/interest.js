import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
// import salesforceModel from '~/models/salesforce-model';
import {description as template} from './interest.html';

export default class InterestForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/interest/interest.css';
        this.view = {
            classes: ['interest-form']
        };
        this.templateHelpers = {
            titles: bookTitles
        };
    }

    onLoaded() {
        selectHandler.setup(this.el);
    }

    /*
    // FIX: Refactor so a view can handle all these events by just listing the relevant elements
    @on('change [type=text],[type=email]')
    saveSetting(event) {
        if (event.target.name) {
            salesforceModel.set(event.target.name, event.target.value);
        }
    }

    onLoaded() {
        // FIX: Move DOM manipulation to the template, just pass the model in
        salesforceModel.prefill(this.el);
    }
    */

}

import {Controller} from 'superb';

import {on} from '~/helpers/controller/decorators';
import {published as titles} from '~/models/book-titles';
// import salesforceModel from '~/models/salesforce-model';
import partners from '~/models/partners';
import {description as template} from './renew.html';

export default class AdoptionForm extends Controller {

    init() {
        this.template = template;
        this.templateHelpers = {
            titles,
            partners
        };
        this.view = {
            classes: ['adoption-form']
        };
    }

    /*
    onLoaded() {
        // FIX: Move to model manipulation, then load normally in template
        salesforceModel.prefill(this.el);
    }

    // FIX: Refactor out
    @on('change [type=text],[type=email]')
    saveSetting(event) {
        if (event.target.name) {
            salesforceModel.set(event.target.name, event.target.value);
        }
    }
    */

}

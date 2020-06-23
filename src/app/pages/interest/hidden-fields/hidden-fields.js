import salesforcePromise, {salesforce} from '~/models/salesforce';
import {Controller} from 'superb.js';
import {description as template} from './hidden-fields.html';

export default class HiddenFields extends Controller {

    init(getRole) {
        this.template = template;
        this.view = {
            classes: ['hidden-fields']
        };
        this.model = () => ({
            role: getRole(),
            salesforce
        });
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        salesforcePromise.then(() => this.update());
    }

}

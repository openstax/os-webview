import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import selectHandler from '~/handlers/select';
import {published as titles} from '~/models/book-titles';
import salesforce from '~/models/salesforce';
import partners from '~/models/partners';
import {description as template} from './renew.html';

export default class AdoptionForm extends SalesforceForm {

    init() {
        this.template = template;
        this.view = {
            classes: ['adoption-form']
        };
        this.model = {
            titles,
            partners,
            salesforce: salesforce.adoption([
                'adopted',
                'recommended'
            ]),
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
            }
        };
    }

    onLoaded() {
        selectHandler.setup(this);
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/confirmation?adoption');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
    }

}

import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {published as titles} from '~/models/book-titles';
import salesforce from '~/models/salesforce';
import partners from '~/models/partners';
import {description as template} from './renew.html';

export default class AdoptionForm extends Controller {

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
    }

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('change')
    updateOnChange() {
        this.update();
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalids = this.el.querySelectorAll('input:invalid');

        this.hasBeenSubmitted = true;
        if (invalids.length) {
            event.preventDefault();
            this.update();
        }
    }

}

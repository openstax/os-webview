import BaseView from '~/helpers/backbone/view';
import TagMultiSelect from '~/components/tag-multi-select/tag-multi-select';
import SingleSelect from '~/components/single-select/single-select';
import salesforceModel from '~/models/salesforce-model';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './adoption.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    templateHelpers: {
        urlOrigin: window.location.origin,
        strips
    }
})
export default class AdoptionForm extends BaseView {
    @on('change [type=text],[type=email]')
    saveSetting(event) {
        let varName = event.target.name;

        if (varName) {
            salesforceModel.set(varName, event.target.value);
        }
    }

    @on('submit form')
    failIfInvalid(event) {
        let invalid = this.el.querySelectorAll('.invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    onRender() {
        this.el.classList.add('adoption-form');
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            new TagMultiSelect().replace(ms);
        }
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            new SingleSelect().replace(ss);
        }
        salesforceModel.prefill(this.el);
    }

}

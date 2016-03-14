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

    failIfInvalid(event) {
        this.el.querySelector('form').classList.add('has-been-submitted');
        for (let widget of this.selectWidgets) {
            widget.doValidChecks();
        }
        let invalid = this.el.querySelectorAll('.invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    onRender() {
        this.el.classList.add('adoption-form');
        this.selectWidgets = [];
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            let widget = new TagMultiSelect();

            widget.replace(ms);
            this.selectWidgets.push(widget);
        }
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            let widget = new SingleSelect();

            widget.replace(ss);
            this.selectWidgets.push(widget);
        }
        salesforceModel.prefill(this.el);
        this.el.querySelector('[type=submit]').addEventListener('click', this.failIfInvalid.bind(this));
    }

    onBeforeClose() {
        this.el.querySelector('[type=submit]').removeEventListener('click', this.failIfInvalid.bind(this));
    }

}

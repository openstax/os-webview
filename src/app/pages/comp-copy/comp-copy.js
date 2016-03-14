import BaseView from '~/helpers/backbone/view';
import salesforceModel from '~/models/salesforce-model';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './comp-copy.hbs';

@props({
    template: template,
    templateHelpers: {
        urlOrigin: window.location.origin
    }
})
export default class CompCopyForm extends BaseView {
    @on('change #decision-date')
    formatDate(e) {
        let value = e.target.value,
            year, month, day;

        [year, month, day] = value.split('-');
        document.getElementById('hidden-decision-date').value = [month, day, year].join('/');
    }

    @on('change [type=text],[type=email]')
    saveSetting(event) {
        let varName = event.target.name;

        if (varName) {
            salesforceModel.set(varName, event.target.value);
        }
    }

    onRender() {
        this.el.classList.add('comp-copy-form');
        salesforceModel.prefill(this.el);
    }
}

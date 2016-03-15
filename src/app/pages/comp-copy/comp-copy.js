import BaseView from '~/helpers/backbone/view';
import salesforceModel from '~/models/salesforce-model';
import SingleSelect from '~/components/single-select/single-select';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './comp-copy.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    templateHelpers: {
        urlOrigin: window.location.origin,
        strips
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
        this.el.classList.add('comp-copy-form');
        salesforceModel.prefill(this.el);
        this.selectWidgets = [];
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            let widget = new SingleSelect();

            widget.replace(ss);
            this.selectWidgets.push(widget);
        }
    }
}

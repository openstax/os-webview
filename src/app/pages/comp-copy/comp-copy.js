import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import salesforceModel from '~/models/salesforce-model';
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
export default class CompCopyForm extends ProxyWidgetView {
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
        super.onRender();
        salesforceModel.prefill(this.el);
    }
}

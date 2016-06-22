import ProxyWidgetView from '~/controllers/proxy-widget-view';
import {on} from '~/helpers/controller/decorators';
// import salesforceModel from '~/models/salesforce-model';
import {description as template} from './comp-copy.html';

export default class CompCopyForm extends ProxyWidgetView {

    init() {
        this.template = template;
        this.css = '/app/pages/comp-copy/comp-copy.css';
        this.view = {
            classes: ['comp-copy-form']
        };
    }

    /*
    onLoaded() {
        salesforceModel.prefill(this.el);
    }

    @on('change #decision-date')
    formatDate(e) {
        const value = e.target.value;
        const [year, month, day] = value.split('-');

        document.getElementById('hidden-decision-date').value = [month, day, year].join('/');
    }

    @on('change [type=text],[type=email]')
    saveSetting(event) {
        // FIX: This if statement is used an awful lot, should it be moved to the set method?
        if (event.target.name) {
            salesforceModel.set(event.target.name, event.target.value);
        }
    }
    */

}

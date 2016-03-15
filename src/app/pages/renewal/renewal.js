import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import salesforceModel from '~/models/salesforce-model';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './renewal.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    templateHelpers: {
        urlOrigin: window.location.origin,
        strips
    }
})
export default class AdoptionForm extends ProxyWidgetView {
    @on('change [type=text],[type=email]')
    saveSetting(event) {
        let varName = event.target.name;

        if (varName) {
            salesforceModel.set(varName, event.target.value);
        }
    }

    onRender() {
        this.el.classList.add('adoption-form');
        super.onRender();
        salesforceModel.prefill(this.el);
    }
}

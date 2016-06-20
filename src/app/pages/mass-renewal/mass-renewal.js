import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import salesforceModel from '~/models/salesforce-model';
import {published as titles} from '~/helpers/book-titles';
import salesforce from '~/helpers/salesforce';
import {on, props} from '~/helpers/backbone/decorators';
import partners from '~/helpers/partners';
import {template} from './mass-renewal.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    css: '/app/pages/adoption/adoption.css',
    templateHelpers: {
        titles,
        urlOrigin: window.location.origin,
        partners,
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
        salesforce.populateAdoptionStatusOptions(this.el, ['adopted', 'recommend', 'no']);
        super.onRender();
        salesforceModel.prefill(this.el);
    }
}

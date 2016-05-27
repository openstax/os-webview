import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import salesforce from '~/helpers/salesforce';
import {props} from '~/helpers/backbone/decorators';
import {template} from './faculty-section.hbs';

@props({
    template: template
})
export default class FacultySection extends ProxyWidgetView {
    onRender() {
        salesforce.populateAdoptionStatusOptions(this.el, ['adopted', 'recommend', 'no'], true);
        super.onRender();
    }
}

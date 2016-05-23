import BaseView from '~/helpers/backbone/view';
import salesforce from '~/helpers/salesforce';
import {props} from '~/helpers/backbone/decorators';
import {template} from './faculty-section.hbs';

@props({
    template: template
})
export default class FacultySection extends BaseView {
    onRender() {
        salesforce.populateAdoptionStatusOptions(this.el);
    }
}

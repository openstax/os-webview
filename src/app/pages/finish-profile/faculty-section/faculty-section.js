import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import salesforce from '~/helpers/salesforce';
import $ from '~/helpers/$';
import {props} from '~/helpers/backbone/decorators';
import {template} from './faculty-section.hbs';

@props({
    template: template
})
export default class FacultySection extends ProxyWidgetView {

    doValidChecks() {
        let institutionalEmailInput = this.el.querySelector('[name="00NU0000005oVQV"][required]'),
            isValid = $.testInstitutionalEmail(institutionalEmailInput);

        if (isValid) {
            institutionalEmailInput.setCustomValidity('');
            institutionalEmailInput.parentNode.classList.remove('invalid');
        } else {
            institutionalEmailInput.setCustomValidity('Cannot be generic');
            institutionalEmailInput.parentNode.classList.add('invalid');
        }
    }

    setRequiredness(whether) {
        if (this.requireds) {
            for (let field of this.requireds) {
                field.required = whether;
            }
        }
    }

    onRender() {
        this.requireds = this.el.querySelectorAll('[required]');
        salesforce.populateAdoptionStatusOptions(this.el, ['adopted', 'recommend', 'no'], true);
        super.onRender();
    }
}

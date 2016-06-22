import ProxyWidgetView from '~/controllers/proxy-widget-view';
import $ from '~/helpers/$';
import salesforce from '~/helpers/salesforce';
import {description as template} from './faculty-section.html';

export default class FacultySection extends ProxyWidgetView {

    init() {
        this.template = template;
    }

    onLoaded() {
        this.requireds = this.el.querySelectorAll('[required]');
        salesforce.populateAdoptionStatusOptions(this.el, ['adopted', 'recommend', 'no'], true);
    }

    doValidChecks() {
        const institutionalEmailInput = this.el.querySelector('[name="00NU0000005oVQV"][required]');
        const isValid = $.testInstitutionalEmail(institutionalEmailInput);

        if (isValid) {
            institutionalEmailInput.setCustomValidity('');
            institutionalEmailInput.parentNode.classList.remove('invalid');
        } else {
            institutionalEmailInput.setCustomValidity('Cannot be generic');
            institutionalEmailInput.parentNode.classList.add('invalid');
        }
    }

    // FIX: Move DOM manipulation to template
    setRequiredness(whether) {
        if (this.requireds) {
            for (const field of this.requireds) {
                field.required = whether;
            }
        }
    }

}

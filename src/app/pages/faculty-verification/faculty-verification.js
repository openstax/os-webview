import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import userModel from '~/models/usermodel';
import salesforceModel from '~/models/salesforce-model';
import $ from '~/helpers/$';
import bookTitles from '~/helpers/book-titles';
import salesforce from '~/helpers/salesforce';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './faculty-verification.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    css: '/app/pages/faculty-verification/faculty-verification.css',
    templateHelpers: {
        titles: bookTitles,
        urlOrigin: window.location.origin,
        strips
    }
})
export default class FacultyVerificationForm extends ProxyWidgetView {
    @on('change [type=text],[type=email]')
    saveSetting(event) {
        let varName = event.target.name;

        if (varName) {
            salesforceModel.set(varName, event.target.value);
        }
    }

    doValidChecks() {
        let institutionalEmailInput = this.el.querySelector('[name="00NU0000005oVQV"]'),
            isValid = $.testInstitutionalEmail(institutionalEmailInput);

        if (isValid) {
            institutionalEmailInput.setCustomValidity('');
            institutionalEmailInput.parentNode.classList.remove('invalid');
        } else {
            institutionalEmailInput.setCustomValidity('Cannot be generic');
            institutionalEmailInput.parentNode.classList.add('invalid');
        }
    }

    onRender() {
        this.el.classList.add('faculty-verification-form');
        salesforce.populateAdoptionStatusOptions(this.el, ['adopted', 'recommend', 'no'], true);
        super.onRender();
        userModel.fetch().then((data) => {
            let userInfo = data[0];

            if (userInfo) {
                this.el.querySelector('[name=user_id]').value = userInfo.username;
                this.el.querySelector('[name=OS_Accounts_ID__c]').value = userInfo.accounts_id;
            }
        });
        salesforceModel.prefill(this.el);
    }
}

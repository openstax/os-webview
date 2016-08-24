import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import {sfModel} from '~/models/usermodel';
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

    disableForm(explanation) {
        let explanationEl = this.el.querySelector('.subhead p'),
            submitEl = this.el.querySelector('.cta [type="submit"]'),
            inputEls = this.el.querySelectorAll('form .col');

        submitEl.disabled = true;
        for (let el of inputEls) {
            el.classList.add('hidden');
        }
        explanationEl.classList.remove('hidden');
        explanationEl.textContent = explanation;
    }

    onRender() {
        this.el.classList.add('faculty-verification-form', 'hidden');
        salesforce.populateAdoptionStatusOptions(this.el, ['adopted', 'recommend', 'no'], true);
        sfModel.fetch().then((data) => {
            const userInfo = data[0];

            if (userInfo && userInfo.username) {
                super.onRender();
                if (!('pending_verification' in userInfo)) {
                    this.el.querySelector('.salesforce-down').classList.remove('hidden');
                    this.el.querySelector('.subhead').classList.add('hidden');
                    this.el.querySelector('form').classList.add('hidden');
                }
                this.el.classList.remove('hidden');
                this.el.querySelector('[name=user_id]').value = userInfo.username;
                this.el.querySelector('[name=OS_Accounts_ID__c]').value = userInfo.accounts_id;
                if (userInfo.pending_verification) {
                    this.disableForm('You already have a verification request pending.');
                }
            } else {
                let loginLink = document.querySelector('.nav-menu-item.login > a');

                loginLink.click();
            }
        });
        salesforceModel.prefill(this.el);
    }
}

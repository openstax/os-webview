import {Controller} from 'superb';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
// import salesforce from '~/helpers/salesforce';
// import userModel from '~/models/usermodel';
import salesforceModel from '~/models/salesforce';
import {description as template} from './faculty-verification.html';

export default class FacultyVerificationForm extends Controller {

    testInstitutionalEmail() {
        const institutionalEmailInput = this.el.querySelector('[name="00NU0000005oVQV"]');
        let isValid = $.testInstitutionalEmail(institutionalEmailInput);

        institutionalEmailInput.setCustomValidity(isValid ? '' : 'We cannot accept that email address');
        return isValid;
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        let otherInvalids = this.el.querySelectorAll('input:invalid');

        this.hasBeenSubmitted = true;
        if (!this.testInstitutionalEmail() || otherInvalids.length) {
            event.preventDefault();
            this.update();
        }
    }

    @on('change')
    updateOnChange() {
        this.testInstitutionalEmail();
        this.update();
    }

    init() {
        this.template = template;
        this.css = '/app/pages/faculty-verification/faculty-verification.css';
        this.view = {
            classes: ['faculty-verification-form']
        };
        const titles = bookTitles.map((titleData) =>
            titleData.text ? titleData : {
                text: titleData,
                value: titleData
            }
        );

        this.model = {
            titles,
            adoptionOptions: salesforceModel.adoption(['adopted', 'recommended', 'no']),
            validationMessage: (name) => this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : ''
        };
    }

    onLoaded() {
        selectHandler.setup(this);
    }

    /*

    doValidChecks() {
        const institutionalEmailInput = this.el.querySelector('[name="00NU0000005oVQV"]');
        const isValid = $.testInstitutionalEmail(institutionalEmailInput);

        if (isValid) {
            institutionalEmailInput.setCustomValidity('');
            institutionalEmailInput.parentNode.classList.remove('invalid');
        } else {
            institutionalEmailInput.setCustomValidity('Cannot be generic');
            institutionalEmailInput.parentNode.classList.add('invalid');
        }
    }

    // FIX: Update model and move all DOM manipulation to template
    disableForm(explanation) {
        const explanationEl = this.el.querySelector('.subhead p');
        const submitEl = this.el.querySelector('.cta [type="submit"]');
        const inputEls = this.el.querySelectorAll('form .col');

        submitEl.disabled = true;
        for (const el of inputEls) {
            el.classList.add('hidden');
        }
        explanationEl.classList.remove('hidden');
        explanationEl.textContent = explanation;
    }

    onLoaded() {
        salesforce.populateAdoptionStatusOptions(this.el, ['adopted', 'recommend', 'no'], true);
        // FIX: Separate model from controller
        userModel.fetch().then((data) => {
            const userInfo = data[0];

            if (userInfo && userInfo.username) {
                // FIX: Move all DOM manipulation to template
                super.onRender();
                this.el.classList.remove('hidden');
                this.el.querySelector('[name=user_id]').value = userInfo.username;
                this.el.querySelector('[name=OS_Accounts_ID__c]').value = userInfo.accounts_id;
                if (userInfo.pending_verification) {
                    this.disableForm('You already have a verification request pending.');
                }
            } else {
                const loginLink = document.querySelector('.nav-menu-item.login > a');

                loginLink.click();
            }
        });
        salesforceModel.prefill(this.el);
    }
    */

}

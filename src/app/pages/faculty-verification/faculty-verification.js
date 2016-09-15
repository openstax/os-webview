import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import $ from '~/helpers/$';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
import {sfUserModel} from '~/models/usermodel';
import salesforceModel from '~/models/salesforce';
import {description as template} from './faculty-verification.html';

export default class FacultyVerificationForm extends SalesforceForm {

    testInstitutionalEmail() {
        const institutionalEmailInput = this.el.querySelector('[name="00NU0000005oVQV"]');
        const isValid = $.testInstitutionalEmail(institutionalEmailInput);

        institutionalEmailInput.setCustomValidity(isValid ? '' : 'We cannot verify a generic email address');
        return isValid;
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
            validationMessage: (name) => this.hasBeenSubmitted ?
                this.el.querySelector(`[name="${name}"]`).validationMessage :
                ''
        };
    }

    onLoaded() {
        document.title = 'Instructor Verification - OpenStax';
        selectHandler.setup(this);
        sfUserModel.load().then((user) => {
            if (user.username) {
                this.model.firstName = user.first_name;
                this.model.lastName = user.last_name;
                this.model.userId = user.username;
                this.model.accountId = user.accounts_id;
                this.model.pendingVerification = user.pending_verification;

                if (user.accounts_id === null) {
                    this.model.problemMessage = 'Could not load user information';
                } else {
                    this.model.problemMessage = '';
                }

                this.update();
            } else {
                const loginLink = document.querySelector('.nav-menu-item.login > a');

                loginLink.click();
            }
            this.formResponseEl = this.el.querySelector('#form-response');
            this.goToConfirmation = () => {
                if (this.submitted) {
                    this.submitted = false;
                    router.navigate('/confirmation?faculty');
                }
            };
            this.formResponseEl.addEventListener('load', this.goToConfirmation);
        });
    }

}

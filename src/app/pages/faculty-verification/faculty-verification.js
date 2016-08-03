import {Controller} from 'superb';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
import salesforce from '~/models/salesforce';
import {description as template} from './faculty-verification.html';

export default class FacultyVerificationForm extends Controller {

    testInstitutionalEmail() {
        const institutionalEmailInput = this.el.querySelector('[name="00NU0000005oVQV"]');
        const isValid = $.testInstitutionalEmail(institutionalEmailInput);

        institutionalEmailInput.setCustomValidity(isValid ? '' : 'We cannot accept that email address');
        return isValid;
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const otherInvalids = this.el.querySelectorAll('input:invalid');

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
            adoptionOptions: salesforce.adoption(['adopted', 'recommended', 'no']),
            validationMessage: (name) => this.hasBeenSubmitted ?
                this.el.querySelector(`[name="${name}"]`).validationMessage : ''
        };
    }

    onLoaded() {
        selectHandler.setup(this);
    }

}

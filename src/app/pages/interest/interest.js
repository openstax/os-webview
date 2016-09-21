import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
import {description as template} from './interest.html';

export default class InterestForm extends SalesforceForm {

    init() {
        this.template = template;
        this.css = '/app/pages/interest/interest.css';
        this.view = {
            classes: ['interest-form']
        };

        const titles = bookTitles.map((titleData) =>
            titleData.text ? titleData : {
                text: titleData,
                value: titleData
            }
        );

        this.model = {
            titles,
            validationMessage: (name) =>
                this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : ''
        };
    }

    onLoaded() {
        document.title = 'Interest Form - OpenStax';
        selectHandler.setup(this);
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/confirmation?interest');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
    }

}

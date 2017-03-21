import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import $ from '~/helpers/$';
import selectHandler from '~/handlers/select';
import {description as template} from './comp-copy.html';

export default class CompCopyForm extends SalesforceForm {

    init() {
        this.template = template;
        this.css = '/app/pages/comp-copy/comp-copy.css';
        this.view = {
            classes: ['comp-copy-form']
        };
        // NOTE: List of books is more limited than the published list in models/book-titles,
        // so using a hard-coded list in the HTML
        this.model = {
            validationMessage: (name) =>
                this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : ''
        };
        this.slug = 'pages/comp-copy';
    }

    onLoaded() {
        document.title = 'Comp Copy Request - OpenStax';
        selectHandler.setup(this);
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/confirmation/compCopy');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
    }

    onDataLoaded() {
        Object.assign(this.model, {
            introHeading: this.pageData.intro_heading,
            introDescription: this.pageData.intro_description
        });
        this.update();
        $.insertHtml(this.el, this.model);
    }

}

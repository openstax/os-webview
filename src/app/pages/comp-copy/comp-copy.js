import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import $ from '~/helpers/$';
import settings from 'settings';
import salesforce from '~/models/salesforce';
import selectHandler from '~/handlers/select';
import {description as template} from './comp-copy.html';

const booksPromise = fetch(`${settings.apiOrigin}/api/books`)
    .then((r) => r.json())
    .then((r) => r.books.filter((b) => b.comp_copy_available && b.salesforce_abbreviation));

export default class CompCopyForm extends SalesforceForm {

    init() {
        this.template = template;
        this.css = '/app/pages/comp-copy/comp-copy.css';
        this.view = {
            classes: ['comp-copy-form']
        };
        this.model = {
            validationMessage: (name) =>
                this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : '',
            salesforce
        };
        this.slug = 'pages/comp-copy';
    }

    onLoaded() {
        document.title = 'Comp Copy Request - OpenStax';
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
        booksPromise.then((books) => {
            this.model.books = books;
            this.update();
            $.insertHtml(this.el, this.model);
            selectHandler.setup(this);
        });
    }

}

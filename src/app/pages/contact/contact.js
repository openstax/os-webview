import SalesforceForm from '~/controllers/salesforce-form';
import CMSPageController from '~/controllers/cms';
import salesforce from '~/models/salesforce';
import router from '~/router';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {description as template} from './contact.html';

const subjects = [
    'General',
    'Adopting OpenStax Textbooks',
    'OpenStax Tutor Support',
    'OpenStax CNX',
    'Donations',
    'College/University Partnerships',
    'Media Inquiries',
    'Foundational Support',
    'OpenStax Partners',
    'Website'
];

class ContactData extends CMSPageController {

    init() {
        this.slug = 'pages/contact-us';
        this.template = () => null;
    }

}

export default class Contact extends SalesforceForm {

    static description = 'If you have a question or feedback about our books, ' +
        'OpenStax Tutor, partnerships, or any other topic, ' +
        'contact us here. We\'d love to hear from you!';

    init() {
        this.dataController = new ContactData();
        this.dataController.onDataLoaded = () => {
            this.pageData = this.dataController.pageData;
            this.onDataLoaded();
        };
        this.template = template;
        this.css = '/app/pages/contact/contact.css';
        this.view = {
            classes: ['contact-page', 'page']
        };
        this.model = {
            salesforceHome: salesforce.salesforceHome,
            subjects,
            tagline: '',
            title: '',
            'mailing_header': '',
            'mailing_address': '',
            'phone_number': '',
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
            }
        };
    }

    onLoaded() {
        document.title = 'Contact Us - OpenStax';

        // NOTE: Cannot set this in the template due to `each` restriction
        const queryDict = $.parseSearchString(window.location.search);
        const defaultSubject = queryDict.subject || 'General';
        const subjectSelect = this.el.querySelector('[name="subject"]');
        const optionPattern = `option[value="${defaultSubject}"]`;
        const defaultSubjectOption = subjectSelect.querySelector(optionPattern);

        if (defaultSubjectOption) {
            defaultSubjectOption.defaultSelected = true;
        }

        selectHandler.setup(this);
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/confirmation/contact');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
    }

    onDataLoaded() {
        this.model = Object.assign(this.model, this.pageData);
        this.update();
        $.insertHtml(this.el, this.model);
    }

}

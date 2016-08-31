import settings from 'settings';
import router from '~/router';
import $ from '~/helpers/$';
import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {description as template} from './contact.html';

const subjects = [
    'General',
    'Adopting OpenStax Textbooks',
    'Concept Coach',
    'OpenStax Tutor Support',
    'OpenStax CNX',
    'Donations',
    'College/University Partnerships',
    'Media Inquiries',
    'Foundational Support',
    'OpenStax Partners',
    'Website'
];

export default class Contact extends CMSPageController {

    static description = 'If you have a question or feedback about our books, ' +
        'OpenStax Tutor, Concept Coach, partnerships, or any other topic, ' +
        'contact us here. We\'d love to hear from you!';

    init() {
        this.slug = 'pages/contact-us';
        this.template = template;
        this.css = '/app/pages/contact/contact.css';
        this.view = {
            classes: ['contact-page', 'page']
        };
        this.model = {
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
    }

    onDataLoaded() {
        this.model = Object.assign(this.model, this.pageData);
        this.update();
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        this.el.querySelector('[data-html="mailing-address"]').innerHTML = this.model.mailing_address;
    }

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('change')
    updateOnChange() {
        this.update();
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalid = this.el.querySelector('form:invalid');

        this.hasBeenSubmitted = true;
        if (invalid) {
            event.preventDefault();
            this.update();
        }
    }

}

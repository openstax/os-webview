import componentType, {canonicalLinkMixin, insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {salesforceFormFunctions} from '~/helpers/controller/salesforce-form-mixin';
import salesforce from '~/models/salesforce';
import routerBus from '~/helpers/router-bus';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {description as template} from './contact.html';
import css from './contact.css';

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
    'Website',
    'OpenStax Polska'
];
const spec = {
    template,
    css,
    view: {
        classes: ['contact-page', 'page']
    },
    model: {
        salesforce,
        subjects
    },
    slug: 'pages/contact'
};

export default class Contact extends componentType(
    spec, salesforceFormFunctions, canonicalLinkMixin, insertHtmlMixin
) {

    init() {
        super.init();
        this.model.validationMessage = (name) => {
            const el = this.el.querySelector(`[name="${name}"]`);

            return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
        };
    }

    onLoaded() {
        super.onLoaded();
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
                routerBus.emit('navigate', '/confirmation/contact');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
    }

    onDataLoaded() {
        Object.assign(this.model, this.pageData);
        this.update();
    }

    @on('change [name="subject"]')
    setFormTarget(event) {
        if (event.target.value === 'OpenStax Polska') {
            this.model.formTarget = '/apps/cms/api/mail/send_mail';
        } else {
            this.model.formTarget = `https://${this.model.salesforce.salesforceHome}/servlet/servlet.WebToCase?encoding=UTF-8`;
        }
        this.update();
    }

}

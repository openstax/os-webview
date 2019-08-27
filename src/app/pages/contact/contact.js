import componentType, {canonicalLinkMixin, insertHtmlMixin, loaderMixin} from '~/helpers/controller/init-mixin';
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
    model() {
        return Object.assign({
            salesforce,
            subjects,
            selected: this.isSelected,
            validationMessage: this.validationMessage,
            formTarget: this.selectedSubject === 'OpenStax Polska' ?
                '/apps/cms/api/mail/send_mail' :
                `https://${salesforce.salesforceHome}/servlet/servlet.WebToCase?encoding=UTF-8`
        }, this.pageData);
    },
    slug: 'pages/contact'
};

export default class Contact extends componentType(
    spec, salesforceFormFunctions, canonicalLinkMixin, insertHtmlMixin, loaderMixin
) {

    init() {
        super.init();
        const queryDict = $.parseSearchString(window.location.search);

        this.selectedSubject = queryDict.subject ? queryDict.subject[0] : 'General';
        this.isSelected = (subj) => $.booleanAttribute(subj === this.selectedSubject);
        this.validationMessage = (name) => {
            const el = this.el.querySelector(`[name="${name}"]`);

            return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
        };
        document.title = 'Contact Us - OpenStax';
    }

    setUpForm() {
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
        this.hideLoader();
        this.update();
        this.setUpForm();
    }

    @on('change [name="subject"]')
    setFormTarget(event) {
        this.selectedSubject = event.target.value;
        this.update();
    }

}

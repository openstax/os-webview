import componentType, {canonicalLinkMixin, insertHtmlMixin} from '~/helpers/controller/init-mixin';
import SalesforceForm from '~/components/salesforce-form/salesforce-form';
import ContactForm from './contact-form/contact-form';
import routerBus from '~/helpers/router-bus';
import {description as template} from './contact.html';
import css from './contact.css';

const spec = {
    template,
    model() {
        return Object.assign({}, this.pageData);
    },
    css,
    view: {
        classes: ['contact-page', 'page']
    },
    slug: 'pages/contact'
};

export default class extends componentType(
    spec, canonicalLinkMixin, insertHtmlMixin
) {

    onUpdate() {
        if (super.onUpdate) {
            super.onUpdate();
        }
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.update();
        const formContainer = this.el.querySelector('.form-container');
        const sfForm = new SalesforceForm({
            afterSubmit: () => {
                routerBus.emit('navigate', '/confirmation/contact');
            }
        });
        const formBody = new ContactForm({
            el: sfForm.regions.formBody.el
        });

        this.regionFrom(formContainer).attach(sfForm);
        formBody.on('is-polish', (whether) => {
            sfForm.emit('update-props', {
                postTo: whether ? '/apps/cms/api/mail/send_mail' : null
            });
        });
    }

};

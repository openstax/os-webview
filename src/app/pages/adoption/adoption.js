import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import ContactInfo from '~/components/contact-info/contact-info';
import {on} from '~/helpers/controller/decorators';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import ManagedComponent from '~/helpers/controller/managed-component';
import partnerPromise from '~/models/partners';
import salesforce from '~/models/salesforce';
import {description as template} from './adoption.html';

export default class AdoptionForm extends SalesforceForm {

    init() {
        super.init();
        this.template = template;
        this.css = '/app/pages/adoption/adoption.css';
        this.view = {
            classes: ['adoption-page', 'page']
        };
        const defaultTitle = decodeURIComponent(window.location.search.substr(1));

        this.model = {
            partners: [],
            validationMessage: (name) =>
                this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : '',
            defaultTitle
        };
        this.contactInfoComponent = new ManagedComponent(
            new ContactInfo(this.model), 'contactInfo', this
        );
        const inputs = {
            howMany: new FormInput({
                name: '00NU00000052VId',
                type: 'number',
                min: '1',
                label: 'How many students are using this book in your courses each semester?',
                required: true,
                validationMessage: this.model.validationMessage
            }),
            otherPartner: new FormInput({
                name: '00NU0000005Vls8',
                type: 'text',
                label: 'Other',
                placeholder: 'Partner resources not listed above?',
                validationMessage: this.model.validationMessage
            }),
            otherInstructors: new FormInput({
                name: '00NU00000055sq1',
                type: 'number',
                min: '0',
                label: 'If there are other instructors in your department who will also be using this' +
                ' book, approximately how many students in your department will be using this' +
                ' book per semester?',
                validationMessage: this.model.validationMessage
            }),
            partnerResources: new FormSelect({
                name: '00NU0000005VmTu',
                label: 'Which partner resources are you using with your book?',
                instructions: 'You may select more than one.',
                multiple: true,
                validationMessage: this.model.validationMessage
            }),
            yourBook: new FormSelect({
                name: '00NU00000053nzR',
                label: 'Your OpenStax book:',
                required: true,
                validationMessage: this.model.validationMessage
            }),
            adoptionStatus: new FormSelect({
                name: '00NU00000055spw',
                label: 'How are you using this book?',
                options: salesforce.adoption(['adopted', 'recommended'])
                .map((opt) => ({label: opt.text, value: opt.value})),
                validationMessage: this.model.validationMessage
            }),
            partnerContact: new FormSelect({
                name: '00NU00000055spm',
                labelHtml: 'Which of our <a href="/partners">partners</a> would' +
                    ' you like to give permission to contact you about additional' +
                    ' resources to support our books?',
                instructions: 'You may select more than one',
                options: [
                    {label: 'None', value: ''},
                    {label: 'Online homework partners', value: 'Online homework partners'},
                    {label: 'Adaptive courseware partners', value: 'Adaptive courseware partners'},
                    {label: 'Customization tool partners', value: 'Customization tool partners'}
                ],
                multiple: true,
                required: true,
                requireNone: true,
                validationMessage: this.model.validationMessage
            }),
            featureMe: new FormSelect({
                name: '00NU00000055sq6',
                label: 'Are you interested in having your OpenStax experience' +
                    ' featured on our website, social media, and/or emails?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                validationMessage: this.model.validationMessage
            }),
            contactMe: new FormSelect({
                name: '00NU00000055sqB',
                label: 'May we contact you about opportunities to participate in' +
                    ' future pilots or research studies?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                validationMessage: this.model.validationMessage
            })
        };

        this.inputComponents = Object.keys(inputs)
            .map((k) => new ManagedComponent(inputs[k], k, this));
    }

    onLoaded() {
        document.title = 'Adoption Form - OpenStax';
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/adoption-confirmation');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
        partnerPromise.then((partners) => {
            const partnerComponent = this.inputComponents.find((c) => c.id === 'partnerResources');
            const options = partners.map((p) => p.title)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({label: title, value: title}));

            options.push({label: 'Other (specify below)', value: 'other-partner'});
            partnerComponent.component.model.options = options;
            partnerComponent.update();
        });
    }

    setBookOptions() {
        const bookComponent = this.inputComponents.find((c) => c.id === 'yourBook');
        const options = this.salesforceTitles.map((title) => ({
            label: title.text,
            value: title.value,
            selected: this.model.defaultTitle === title.value
        }));

        bookComponent.component.setOptions(options);
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.model.titles = this.salesforceTitles;
        this.setBookOptions();
        this.update();
        this.contactInfoComponent.attach();
        for (const c of this.inputComponents) {
            c.attach();
        }
    }

    onUpdate() {
        this.contactInfoComponent.update();
        for (const c of this.inputComponents) {
            c.update();
        }
    }

    beforeSubmit() {
        return !this.contactInfoComponent.component.checkSchoolName();
    }

}

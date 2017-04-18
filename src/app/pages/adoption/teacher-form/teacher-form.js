import SalesforceForm from '~/controllers/salesforce-form';
import salesforce from '~/models/salesforce';
import router from '~/router';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import ManagedComponent from '~/helpers/controller/managed-component';
import ContactInfo from '~/components/contact-info/contact-info';
import partnerPromise from '~/models/partners';
import {description as template} from './teacher-form.html';

export default class TeacherForm extends SalesforceForm {

    init(model) {
        super.init();
        this.template = template;
        this.view = {
            classes: ['labeled-inputs', 'row', 'top-of-form']
        };
        this.regions = {
            contactInfo: '[data-id="contactInfo"]'
        };
        const validationMessage = (name) => {
            const field = this.el && this.el.querySelector(`[name="${name}"]`);

            if (this.hasBeenSubmitted && field) {
                return field.validationMessage;
            }
            return '';
        };
        const inputs = {
            howMany: new FormInput({
                name: '00NU00000052VId',
                type: 'number',
                min: '1',
                label: 'How many students are using this book in your courses each semester?',
                required: true,
                validationMessage
            }),
            otherPartner: new FormInput({
                name: '00NU0000005Vls8',
                type: 'text',
                label: 'Other',
                placeholder: 'Partner resources not listed above?',
                validationMessage
            }),
            otherInstructors: new FormInput({
                name: '00NU00000055sq1',
                type: 'number',
                min: '0',
                label: 'If there are other instructors in your department who will also be using this' +
                ' book, approximately how many students in your department will be using this' +
                ' book per semester?',
                validationMessage
            }),
            partnerResources: new FormSelect({
                name: '00NU0000005VmTu',
                label: 'Which partner resources are you using with your book?',
                instructions: 'You may select more than one.',
                multiple: true,
                validationMessage
            }),
            yourBook: new FormSelect({
                name: '00NU00000053nzR',
                label: 'Your OpenStax book:',
                required: true,
                validationMessage
            }),
            adoptionStatus: new FormSelect({
                name: '00NU00000055spw',
                label: 'How are you using this book?',
                options: salesforce.adoption(['adopted', 'recommended'])
                .map((opt) => ({label: opt.text, value: opt.value})),
                validationMessage
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
                validationMessage
            }),
            featureMe: new FormSelect({
                name: '00NU00000055sq6',
                label: 'Are you interested in having your OpenStax experience' +
                    ' featured on our website, social media, and/or emails?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                validationMessage
            }),
            contactMe: new FormSelect({
                name: '00NU00000055sqB',
                label: 'May we contact you about opportunities to participate in' +
                    ' future pilots or research studies?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                validationMessage
            })
        };

        this.model = Object.assign(model, {
            validationMessage
        });

        this.inputComponents = Object.keys(inputs).map((k) =>
            new ManagedComponent(inputs[k], k, this)
        );
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

    onLoaded() {
        this.model.titles = this.salesforceTitles;
        for (const c of this.inputComponents) {
            c.attach();
        }
        partnerPromise.then((partners) => {
            const partnerComponent = this.inputComponents.find((c) => c.id === 'partnerResources');
            const options = partners.map((p) => p.title)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({label: title, value: title}));

            options.push({label: 'Other (specify below)', value: 'other-partner'});
            partnerComponent.component.setOptions(options);
            partnerComponent.update();
        });
        this.contactInfo = new ContactInfo(this.model);
        this.regions.contactInfo.attach(this.contactInfo);
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.setBookOptions();
        this.update();
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/adoption-confirmation');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
    }

    onClose() {
        this.formResponseEl.removeEventListener('load', this.goToConfirmation);
    }

    onUpdate() {
        for (const c of this.inputComponents) {
            c.update();
        }
        this.contactInfo && this.contactInfo.update();
    }

    beforeSubmit() {
        return !this.contactInfo.checkSchoolName();
    }

    doCustomValidation(event) {
        super.doCustomValidation(event);
        this.contactInfo.update();
    }

}

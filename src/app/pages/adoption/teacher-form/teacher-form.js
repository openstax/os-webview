import SalesforceForm from '~/controllers/salesforce-form';
import salesforce from '~/models/salesforce';
import router from '~/router';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
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
        this.defaultTitle = decodeURIComponent(window.location.search.substr(1));
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
                label: 'How many students are using this book in your courses this semester?',
                required: true,
                validationMessage
            }),
            otherPartner: new FormInput({
                name: '00NU0000005Vls8',
                type: 'text',
                label: 'Other (include all other technologies you use)',
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
            yourBook: new FormSelect({
                name: '00NU00000053nzR',
                label: 'Your OpenStax book:',
                required: true,
                validationMessage
            }),
            adoptionStatus: new FormRadioGroup({
                name: '00NU00000055spw',
                label: 'How are you using your book?',
                options: salesforce.adoption(['adopted', 'recommended'])
                    .map((opt) => ({label: opt.text, value: opt.value})),
                validationMessage,
                required: true
            }),
            partnerContact: new FormCheckboxGroup({
                name: '00NU00000055spm',
                label: 'Which of our partners would you like to give permission' +
                    ' to contact you about additional resources to support our books?',
                instructions: 'Select all that apply.',
                options: [
                    {label: 'Online homework partners', value: 'Online homework partners'},
                    {label: 'Adaptive courseware partners', value: 'Adaptive courseware partners'},
                    {label: 'Customization tool partners', value: 'Customization tool partners'}
                ],
                multiple: true,
                required: true,
                requireNone: true,
                validationMessage
            }),
            featureMe: new FormRadioGroup({
                name: '00NU00000055sq6',
                label: 'Are you interested in having your OpenStax experience' +
                    ' featured on our website, social media, and/or emails?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                value: '0',
                classes: ['two-columns'],
                validationMessage
            }),
            contactMe: new FormRadioGroup({
                name: '00NU00000055sqB',
                label: 'May we contact you about opportunities to participate in' +
                    ' future pilots or research studies?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                value: '0',
                classes: ['two-columns'],
                validationMessage
            })
        };

        this.model = Object.assign(model, {
            validationMessage,
            salesforce,
            currentSection: 1,
            showOtherBlank: false
        });

        this.inputComponents = Object.keys(inputs).map((k) =>
            new ManagedComponent(inputs[k], k, this)
        );
    }

    setBookOptions() {
        this.model.subjects = Array.from(new Set(this.salesforceTitles.map((book) => book.subject))).sort();
        this.model.booksBySubject = (subject) => {
            return this.salesforceTitles
                .filter((b) => b.subject === subject)
                .sort();
        };
    }

    onLoaded() {
        this.model.titles = this.salesforceTitles;
        for (const c of this.inputComponents) {
            c.attach();
        }
        partnerPromise.then((partners) => {
            const options = partners.map((p) => p.title)
                .sort((a, b) => a.localeCompare(b))
                .map((title) => ({label: title, value: title}));

            options.push({label: 'Other (specify below)', value: 'other-partner'});
            this.model.partnerResourceOptions = options;
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

    @on('click button.next')
    nextSection(event) {
        const invalid = super.doCustomValidation(event);

        if (invalid) {
            return;
        }
        if (!this.contactInfo.checkSchoolName() && this.model.currentSection < 4) {
            this.model.currentSection += 1;
            event.preventDefault();
            this.hasBeenSubmitted = false;
            this.update();
            $.scrollTo(this.el);
        }
    }

    @on('click button.back')
    previousSection(event) {
        this.model.currentSection -= 1;
        this.update();
        $.scrollTo(this.el);
        event.preventDefault();
    }

    @on('change [value="other-partner"]')
    toggleOtherBlank(event) {
        this.model.showOtherBlank = event.target.checked;
        this.update();
    }

    doCustomValidation(event) {
        super.doCustomValidation(event);
        this.contactInfo.update();
    }

}

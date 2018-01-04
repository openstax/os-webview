import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import salesforce from '~/models/salesforce';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import FormInput from '~/components/form-input/form-input';
import ManagedComponent from '~/helpers/controller/managed-component';
import ContactInfo from '~/components/contact-info/contact-info';
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
            whichBook: new FormCheckboxGroup({
                name: '00NU00000053nzR',
                longLabel: 'Which OpenStax textbook(s) are you interested in adopting?',
                instructions: 'Select all that apply.',
                required: true,
                multiple: true,
                validationMessage
            }),
            howMany: new FormInput({
                name: '00NU00000052VId',
                longLabel: 'How many students do you teach each semester?',
                type: 'number',
                min: '1',
                required: true,
                validationMessage
            }),
            partnerContact: new FormCheckboxGroup({
                name: '00NU00000055spm',
                longLabel: 'Which of our partners would you like to give permission' +
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
            hearAbout: new FormCheckboxGroup({
                name: '00NU00000055spr',
                longLabel: 'How did you hear about OpenStax?',
                instructions: 'Select all that apply.',
                options: [
                    {value: 'Web search', label: 'Web search'},
                    {value: 'Colleague', label: 'Colleague'},
                    {value: 'Conference', label: 'Conference'},
                    {value: 'Email', label: 'Email'},
                    {value: 'Facebook', label: 'Facebook'},
                    {value: 'Twitter', label: 'Twitter'},
                    {value: 'Webinar', label: 'Webinar'},
                    {value: 'Partner organization', label: 'Partner organization'}
                ],
                multiple: true,
                required: true,
                validationMessage
            })
        };

        this.model = Object.assign(model, {
            validationMessage,
            salesforce,
            currentSection: 1,
            showOtherBlank: false
        });

        this.inputComponents = Object.keys(inputs)
            .map((k) => new ManagedComponent(inputs[k], k, this));
    }

    setBookOptions() {
        const whichBookComponent = this.inputComponents
            .find((c) => c.id === 'whichBook')
            .component;

        whichBookComponent.model.options = this.salesforceTitles.map((title) => ({
            label: title.text,
            value: title.value,
            selected: this.model.defaultTitle === title.value
        }));
        whichBookComponent.update();
    }

    onLoaded() {
        this.contactInfo = new ContactInfo(this.model);
        this.regions.contactInfo.attach(this.contactInfo);
        for (const c of this.inputComponents) {
            c.attach();
        }
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.model.titles = this.salesforceTitles;
        this.setBookOptions();
        this.update();
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/interest-confirmation');
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

    @on('change [type="checkbox"]:not([value]')
    toggleOtherBlank(event) {
        this.model.showOtherBlank = event.target.checked;
        this.update();
    }

}

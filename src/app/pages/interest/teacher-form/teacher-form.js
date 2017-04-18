import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
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
            whichBook: new FormSelect({
                name: '00NU00000053nzR',
                label: 'Which OpenStax textbook(s) are you interested in adopting?',
                instructions: 'Select at least one.',
                required: true,
                multiple: true,
                validationMessage
            }),
            howMany: new FormInput({
                name: '00NU00000052VId',
                label: 'How many students do you teach each semester?',
                type: 'number',
                min: '1',
                required: true,
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
            hearAbout: new FormSelect({
                name: '00NU00000055spr',
                label: 'How did you hear about OpenStax?',
                instructions: 'Select at least one.',
                options: [
                    {value: 'Web search', label: 'Web search'},
                    {value: 'Colleague', label: 'Colleague'},
                    {value: 'Conference', label: 'Conference'},
                    {value: 'Email', label: 'Email'},
                    {value: 'Facebook', label: 'Facebook'},
                    {value: 'Twitter', label: 'Twitter'},
                    {value: 'Webinar', label: 'Webinar'},
                    {value: 'Partner organization', label: 'Partner organization'},
                    {value: '', label: 'Other (specify below)'}
                ],
                multiple: true,
                required: true,
                validationMessage
            })
        };

        this.model = Object.assign(model, {
            validationMessage
        });

        this.inputComponents = Object.keys(inputs)
            .map((k) => new ManagedComponent(inputs[k], k, this));
    }

    setBookOptions() {
        const bookComponent = this.inputComponents.find((c) => c.id === 'whichBook');
        const options = this.salesforceTitles.map((title) => ({
            label: title.text,
            value: title.value,
            selected: this.model.defaultTitle === title.value
        }));

        bookComponent.component.setOptions(options);
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

}

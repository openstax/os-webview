import SalesforceForm from '~/controllers/salesforce-form';
import salesforce from '~/models/salesforce';
import FormSelect from '~/components/form-select/form-select';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import ManagedComponent from '~/helpers/controller/managed-component';
import {description as template} from './supplemental-form.html';

export default class SupplementalForm extends SalesforceForm {

    init(email, loadFinalThankYou) {
        this.template = template;
        this.view = {
            classes: ['supplemental-form']
        };
        this.model = {
            salesforce,
            email
        };
        this.loadFinalThankYou = loadFinalThankYou;

        const validationMessage = (name) => {
            const field = this.el && this.el.querySelector(`[name="${name}"]`);

            if (this.hasBeenSubmitted && field) {
                return field.validationMessage;
            }
            return '';
        };
        const inputs = {
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
                classes: ['flexrow'],
                validationMessage
            }),
            contactMe: new FormRadioGroup({
                name: '00NU00000055sqB',
                label: 'May we contact you about opportunities to participate in' +
                    ' future pilots or research studies?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                value: '0',
                classes: ['flexrow'],
                validationMessage
            })
        };

        this.inputComponents = Object.keys(inputs).map((k) =>
            new ManagedComponent(inputs[k], k, this)
        );
    }

    onLoaded() {
        for (const c of this.inputComponents) {
            c.attach();
        }
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                this.loadFinalThankYou();
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
    }

}

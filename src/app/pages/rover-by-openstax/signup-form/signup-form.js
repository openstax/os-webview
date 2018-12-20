import $ from '~/helpers/$';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import SalesforceForm from '~/controllers/salesforce-form';
import {description as template} from './signup-form.html';

export default class SignupForm extends SalesforceForm {

    init(roles, onChange) {
        this.template = template;
        this.roles = roles;
        this.onChange = onChange;
        this.regions = {
            selector: '.selector',
            common: '.common-fields',
            instructor: '.instructor-only'
        };
        this.selectedRole = null;
        this.commonInputs = null;
        this.instructorInput = null;
    }

    validationMessage(name) {
        return this.validated ? this.el.querySelector(`[name="${name}"]`).validationMessage : '';
    };

    createCommonInputs() {
        const validationMessage = this.validationMessage.bind(this);
        const commonInputs = [
            new FormInput({
                name: 'first_name',
                type: 'text',
                label: 'First name',
                required: true,
                autocomplete: 'given-name',
                validationMessage
            }),
            new FormInput({
                name: 'last_name',
                type: 'text',
                label: 'Last name',
                required: true,
                autocomplete: 'family-name',
                validationMessage
            }),
            new FormInput({
                name: 'email',
                type: 'email',
                label: 'Email address',
                required: true,
                autocomplete: 'email',
                validationMessage
            }),
            new FormInput({
                name: 'company',
                type: 'text',
                label: 'School name',
                required: true,
                autocomplete: 'organization',
                validationMessage,
                suggestions: []
            })
        ];

        commonInputs.forEach((c) => this.regions.common.append(c));
        return commonInputs;
    }

    createInstructorInput() {
        const validationMessage = this.validationMessage.bind(this);
        const instructorInput = new FormInput({
            name: 'Number_of_Students__c',
            label: 'How many students do you teach each semester?',
            type: 'number',
            min: '1',
            required: true,
            validationMessage
        });

        this.regions.instructor.append(instructorInput);
        return instructorInput;
    }


    onLoaded() {
        const roleOptions = this.roles
            .map((opt) => ({label: opt.display_name, value: opt.salesforce_name}));
        const roleSelector = new FormSelect({
            name: 'Role__c',
            instructions: 'I am a',
            validationMessage: () => '',
            placeholder: 'Please select one',
            options: roleOptions
        }, (newValue) => {
            this.selectedRole = newValue;
            this.onChange(newValue);
            this.update();
        });

        this.regions.selector.attach(roleSelector);
    }

    // eslint-disable-next-line complexity
    onUpdate() {
        if (!this.selectedRole) {
            return;
        }
        if (!this.commonInputs) {
            this.commonInputs = this.createCommonInputs();
        }
        if (!['Faculty', 'Adjunct Faculty'].includes(this.selectedRole)) {
            if (this.instructorInput) {
                this.instructorInput.detach();
                this.instructorInput = null;
            }
        } else if (!this.instructorInput) {
            this.instructorInput = this.createInstructorInput();
        }
    }

}

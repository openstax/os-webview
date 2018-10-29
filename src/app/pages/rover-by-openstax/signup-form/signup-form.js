import $ from '~/helpers/$';
import VERSION from '~/version';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import SalesforceForm from '~/controllers/salesforce-form';

export default class SignupForm extends SalesforceForm {

    init(roles) {
        this.template = () => '';
        this.roles = roles;
    }

    update() {
        const disable = ! Boolean(this.selectedRole);
        const elements = Array.from(document.querySelectorAll('input[required],[type="submit"]'));

        elements.forEach((el) => {
            el.disabled = disable;
        });
    }

    onLoaded() {
        const region = this.regions.self;
        const validationMessage = function (name) {
            return this.validated ? this.el.querySelector(`[name="${name}"]`).validationMessage : '';
        };
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
            this.update();
            $.scrollTo(this.el);
        });
        const inputs = [
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
            }),
            new FormInput({
                name: 'Number_of_Students__c',
                label: 'How many students do you teach each semester?',
                type: 'number',
                min: '1',
                required: true,
                validationMessage
            })
        ];

        region.attach(roleSelector);
        inputs.forEach((i) => {
            region.append(i);
        });
        setTimeout(() => this.update(), 200);
    }

}

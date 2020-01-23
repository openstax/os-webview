import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './form.html';
import css from './form.css';
import FormInput from '~/components/form-input/form-input';
import {on} from '~/helpers/controller/decorators';
import cmsFetch from '~/models/cmsFetch';
import settings from 'settings';
import $ from '~/helpers/$';

const spec = {
    template,
    css,
    view: {
        classes: ['cf-signup-form']
    },
    model() {
        return {
            origin: `${settings.apiOrigin}/${settings.apiPrefix}`,
            session: this.session,
            disabled: $.booleanAttribute(this.submitDisabled)
        };
    },
    regions: {
        inputs: '.inputs'
    },
    emailValidationMessage: '',
    lastCheckedValue: ''
};

export default class extends componentType(spec) {

    get submitDisabled() {
        const invalids = Boolean(this.el.querySelector('form:invalid'));

        return invalids || this.emailValidationMessage !== '';
    }

    onLoaded() {
        const validationMessage = (name) => {
            const input = this.el.querySelector(`[name="${name}"]`);

            this.update();
            return input && input.matches(':invalid') ?
                input.validationMessage : '';
        };

        this.emailInput = new FormInput({
            name: 'registration_email',
            type: 'email',
            label: 'Email address',
            required: true,
            autocomplete: 'email',
            validationMessage: (name) => {
                const input = this.el.querySelector(`[name="${name}"]`);
                const addr = input && input.value;
                const setValidationMessageFromEmailCheck = (response) => {
                    if (!response.eventbrite_registered) {
                        this.emailValidationMessage = 'Not registered for Creator Fest!';
                    } else if (response.session_registered) {
                        this.emailValidationMessage = 'Already registered for a session.';
                    } else {
                        this.emailValidationMessage = '';
                    }
                };

                if (!addr) {
                    this.emailValidationMessage = '';
                } else if (input.matches(':invalid')) {
                    this.emailValidationMessage = input.validationMessage;
                } else if (addr !== this.lastCheckedValue) {
                    this.emailValidationMessage = 'checking...';
                    cmsFetch(`events/check?email=${addr}`).then(
                        (response) => {
                            setValidationMessageFromEmailCheck(response);
                            this.emailInput.update();
                            this.update();
                        },
                        (err) => {
                            this.emailValidationMessage = `Cannot validate email: ${err}`;
                            this.emailInput.update();
                            this.update();
                        }
                    );
                }
                this.lastCheckedValue = addr;
                return this.emailValidationMessage;
            }
        });
        [
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
            this.emailInput
        ].forEach((input) => {
            this.regions.inputs.append(input);
        });
        this.update();
    }

};

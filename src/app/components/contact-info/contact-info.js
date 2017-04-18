import {Controller} from 'superb';
import Popup from '~/components/popup/popup';
import FormInput from '~/components/form-input/form-input';
import ManagedComponent from '~/helpers/controller/managed-component';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './contact-info.html';

export default class ContactInfo extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['labeled-inputs', 'row', 'top-of-form']
        };
        this.regions = {
            popup: 'pop-up'
        };
        const inputs = {
            firstName: new FormInput({
                name: 'first_name',
                type: 'text',
                label: 'First name',
                required: true,
                validationMessage: this.model.validationMessage
            }),
            lastName: new FormInput({
                name: 'last_name',
                type: 'text',
                label: 'Last name',
                required: true,
                validationMessage: this.model.validationMessage
            }),
            email: new FormInput({
                name: 'email',
                type: 'email',
                label: 'Email address',
                required: true,
                validationMessage: this.model.validationMessage
            }),
            phone: new FormInput({
                name: 'phone',
                type: 'text',
                label: 'Phone number',
                required: true,
                validationMessage: this.model.validationMessage
            }),
            school: new FormInput({
                name: 'company',
                type: 'text',
                label: 'School name',
                required: true,
                validationMessage: this.model.validationMessage
            }),
            schoolUrl: new FormInput({
                name: 'URL',
                type: 'url',
                label: 'School url',
                value: 'http://',
                required: true,
                pattern: '.*[.][a-zA-Z][a-zA-Z]+',
                validationMessage: this.model.validationMessage
            })
        };

        this.components = Object.keys(inputs).map((k) =>
            new ManagedComponent(inputs[k], k, this)
        );
    }

    onLoaded() {
        for (const c of this.components) {
            c.attach();
        }
    }

    updateSchoolUrlModel() {
        const schoolUrlComponent = this.components.find((c) => c.id === 'schoolUrl');

        if (schoolUrlComponent) {
            const schoolUrlModel = schoolUrlComponent.component.model;
            const isHomeSchool = this.model.selectedRole === 'Homeschool Instructor';

            schoolUrlModel.required = !isHomeSchool;
            if (schoolUrlModel.value === 'http://' && isHomeSchool) {
                schoolUrlModel.value = '';
            } else if (schoolUrlModel.value === '' && !isHomeSchool) {
                schoolUrlModel.value = 'http://';
            }
        }
    }

    onUpdate() {
        this.updateSchoolUrlModel();
        for (const c of this.components) {
            c.update();
        }
    }

    checkSchoolName() {
        const schoolName = this.el.querySelector('[name="company"]').value;

        if (this.askedAboutSchool !== schoolName && schoolName.length > 0 && schoolName.length < 5) {
            new ManagedComponent(
                new Popup('Please enter your full school name without abbreviations.' +
                ' If this is your full school name, you can hit Submit.',
                () => this.popupComponent.detach()),
                'popup',
                this
            ).attach();
            this.askedAboutSchool = schoolName;
            return true;
        }
        return false;
    }

}

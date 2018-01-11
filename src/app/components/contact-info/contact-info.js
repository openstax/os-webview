import {Controller} from 'superb.js';
import Popup from '~/components/popup/popup';
import FormInput from '~/components/form-input/form-input';
import ManagedComponent from '~/helpers/controller/managed-component';
import {schoolPromise} from '~/models/schools';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './contact-info.html';

export default class ContactInfo extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
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
                validationMessage: this.model.validationMessage,
                suggestions: []
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
        this.componentsById = {};
        for (const c of this.components) {
            this.componentsById[c.id] = c.component;
        }
        schoolPromise.then((schools) => {
            const schoolComponent = this.componentsById.school;

            this.knownSchools = schools;
            if (schoolComponent) {
                schoolComponent.model.suggestions = schools;
            }
        });
    }

    onLoaded() {
        for (const c of this.components) {
            c.attach();
        }
    }

    schoolMatchesSuggestion() {
        const value = this.componentsById.school.el.querySelector('input').value;

        return this.knownSchools && this.knownSchools.includes(value);
    }

    schoolUrlIsRequired() {
        const isHomeSchool = (/home ?school/i).test(this.model.selectedRole);

        return !isHomeSchool && !this.schoolMatchesSuggestion();
    }

    updateSchoolUrlModel() {
        const schoolUrlComponent = this.componentsById.schoolUrl;

        if (schoolUrlComponent) {
            const schoolUrlModel = schoolUrlComponent.model;
            const schoolUrlValue = schoolUrlComponent.getValue();

            schoolUrlModel.required = this.schoolUrlIsRequired();
            if (schoolUrlValue === 'http://' && !schoolUrlModel.required) {
                schoolUrlComponent.setValue('');
            } else if ((schoolUrlModel.required || schoolUrlValue) && !schoolUrlValue.includes('//')) {
                schoolUrlComponent.setValue(`http://${schoolUrlValue}`);
            }
        }
    }

    onUpdate() {
        this.updateSchoolUrlModel();
        for (const c of this.components) {
            c.update();
        }
    }

    @on('focusout [name="company"],[name="URL"]')
    updateOnChange(event) {
        this.update();
    }

    checkSchoolName() {
        const schoolName = this.el.querySelector('[name="company"]').value;

        if (this.askedAboutSchool !== schoolName && schoolName.length > 0 && schoolName.length < 5) {
            new ManagedComponent(
                new Popup('Please enter your full school name without abbreviations.' +
                ' If this is your full school name, you can hit Next.',
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

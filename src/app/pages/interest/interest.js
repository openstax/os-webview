import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import $ from '~/helpers/$';
import settings from 'settings';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import ManagedComponent from '~/helpers/controller/managed-component';
import ContactInfo from '~/components/contact-info/contact-info';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './interest.html';

const headerInfoPromise = fetch(`${settings.apiOrigin}/api/pages/interest-form`)
.then((r) => r.json());

export default class InterestForm extends SalesforceForm {

    init() {
        super.init();
        this.template = template;
        this.css = '/app/pages/interest/interest.css';
        this.view = {
            classes: ['interest-form']
        };
        const defaultTitle = decodeURIComponent(window.location.search.substr(1));

        this.model = {
            validationMessage: (name) =>
                this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : '',
            defaultTitle
        };
        this.contactInfoComponent = new ManagedComponent(
            new ContactInfo(this.model), 'contactInfo', this
        );

        const inputs = {
            whichBook: new FormSelect({
                name: '00NU00000053nzR',
                label: 'Which OpenStax textbook(s) are you interested in adopting?',
                instructions: 'Select at least one.',
                required: true,
                multiple: true,
                validationMessage: this.model.validationMessage
            }),
            howMany: new FormInput({
                name: '00NU00000052VId',
                label: 'How many students do you teach each semester?',
                type: 'number',
                min: '1',
                required: true,
                validationMessage: this.model.validationMessage
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
                validationMessage: this.model.validationMessage
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
                validationMessage: this.model.validationMessage
            })
        };

        this.inputComponents = Object.keys(inputs)
            .map((k) => new ManagedComponent(inputs[k], k, this));
    }

    onLoaded() {
        document.title = 'Interest Form - OpenStax';
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/interest-confirmation');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);

        headerInfoPromise.then((response) => {
            this.model.introHeading = response.intro_heading;
            this.model.introDescription = response.intro_description;
            this.update();
            $.insertHtml(this.el, this.model);
        });
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

    onDataLoaded() {
        super.onDataLoaded();
        this.model.titles = this.salesforceTitles;
        this.setBookOptions();
        this.update();
        const Region = this.regions.self.constructor;
        const regionEl = this.el.querySelector('component[data-id="contactInfo"]');
        const contactRegion = new Region(regionEl);

        this.contactInfoComponent.attach();
        for (const c of this.inputComponents) {
            c.attach();
        }
    }

    onUpdate() {
        this.contactInfoComponent.update();
        for (const c of this.inputComponents) {
            c.update();
        }
    }

    beforeSubmit() {
        return !this.contactInfoComponent.component.checkSchoolName();
    }

}

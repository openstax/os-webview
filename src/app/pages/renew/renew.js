import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import selectHandler from '~/handlers/select';
import salesforce from '~/models/salesforce';
import partnerPromise from '~/models/partners';
import FormSelect from '~/components/form-select/form-select';
import ManagedComponent from '~/helpers/controller/managed-component';
import {description as template} from './renew.html';

export default class AdoptionForm extends SalesforceForm {

    init() {
        super.init();
        this.template = template;
        this.css = '/app/pages/renew/renew.css';
        this.view = {
            classes: ['renewal-form']
        };
        this.model = {
            partners: [],
            salesforce: salesforce.adoption([
                'adopted',
                'recommended'
            ]),
            salesforceHome: salesforce.salesforceHome,
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
            }
        };
        const validationMessage = (name) => {
            const field = this.el && this.el.querySelector(`[name="${name}"]`);

            if (this.hasBeenSubmitted && field) {
                return field.validationMessage;
            }
            return '';
        };
        const inputs = {
            yourBook: new FormSelect({
                name: '00NU00000053nzR',
                label: 'Your OpenStax book:',
                required: true,
                validationMessage
            }),
            adoptionStatus: new FormSelect({
                name: '00NU00000055spw',
                label: 'How are you using this book?',
                labelHtml: '<small><i>(optional)</i></small>',
                options: salesforce.adoption(['adopted', 'recommended'])
                .map((opt) => ({label: opt.text, value: opt.value})),
                validationMessage
            }),
            partnerResources: new FormSelect({
                name: '00NU0000005VmTu',
                label: 'Which partner resources are you using with your book?',
                instructions: 'You may select more than one.',
                multiple: true,
                validationMessage
            }),
            partnerContact: new FormSelect({
                name: '00NU00000055spm',
                labelHtml: 'Which of our <a href="/partners">partners</a> would' +
                    ' you like to give permission to contact you about additional' +
                    ' resources to support our books?',
                instructions: 'You may select more than one',
                options: [
                    {label: 'Online homework partners', value: 'Online homework partners'},
                    {label: 'Adaptive courseware partners', value: 'Adaptive courseware partners'},
                    {label: 'Customization tool partners', value: 'Customization tool partners'}
                ],
                multiple: true,
                validationMessage
            }),
            featureMe: new FormSelect({
                name: '00NU00000055sq6',
                label: 'Are you interested in having your OpenStax experience' +
                    ' featured on our website, social media, and/or emails?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                validationMessage
            }),
            contactMe: new FormSelect({
                name: '00NU00000055sqB',
                label: 'May we contact you about opportunities to participate in' +
                    ' future pilots or research studies?',
                options: FormSelect.YES_NO_OPTIONS,
                required: true,
                validationMessage
            })
        };

        this.inputComponents = Object.keys(inputs).map((k) =>
            new ManagedComponent(inputs[k], k, this)
        );
    }

    onLoaded() {
        document.title = 'Renew - OpenStax';

        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/adoption-confirmation');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
        partnerPromise.then((partners) => {
            const partnerComponent = this.inputComponents.find((c) => c.id === 'partnerResources');
            const options = partners.map((p) => p.title)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({label: title, value: title}));

            options.push({label: 'Other (specify below)', value: 'other-partner'});
            partnerComponent.component.setOptions(options);
            partnerComponent.update();
        });
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.model.titles = this.salesforceTitles.filter((t) => !t.comingSoon);
        this.update();
        for (const c of this.inputComponents) {
            c.attach();
        }
        this.setBookOptions();
    }

    onUpdate() {
        for (const c of this.inputComponents) {
            c.update();
        }
    }

    setBookOptions() {
        const bookComponent = this.inputComponents.find((c) => c.id === 'yourBook');
        const options = this.salesforceTitles.map((title) => ({
            label: title.text,
            value: title.value,
            selected: this.defaultTitle === title.value
        }));

        bookComponent.component.setOptions(options);
    }

}

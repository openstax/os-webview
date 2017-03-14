import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import ContactInfo from '~/components/contact-info/contact-info';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import partnerPromise from '~/models/partners';
import salesforce from '~/models/salesforce';
import {description as template} from './adoption.html';

export default class AdoptionForm extends SalesforceForm {

    init() {
        super.init();
        this.template = template;
        this.css = '/app/pages/adoption/adoption.css';
        this.view = {
            classes: ['adoption-page', 'page']
        };
        const defaultTitle = decodeURIComponent(window.location.search.substr(1));

        this.model = {
            partners: [],
            salesforce: {
                adoption: {
                    name: salesforce.adoptionName,
                    options: salesforce.adoption(['adopted', 'recommended'])
                }
            },
            validationMessage: (name) =>
                this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : '',
            defaultTitle
        };
        this.contactInfoComponent = new ContactInfo(this.model);
    }

    onLoaded() {
        document.title = 'Adoption Form - OpenStax';
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/adoption-confirmation');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
        partnerPromise.then((partners) => {
            this.model.partners = partners.map((p) => p.title)
            .sort((a, b) => a.localeCompare(b));
            this.update();
        });
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.model.titles = this.salesforceTitles;
        this.update();
        const Region = this.regions.self.constructor;
        const regionEl = this.el.querySelector('component[data-id="contactInfo"]');
        const contactRegion = new Region(regionEl);

        contactRegion.attach(this.contactInfoComponent);
        selectHandler.setup(this);
    }

    onUpdate() {
        if (this.contactInfoComponent) {
            this.contactInfoComponent.update();
        }
    }

    @on('click [type="submit"]')
    checkSchoolName(e) {
        if (!this.contactInfoComponent.checkSchoolName(e)) {
            super.doCustomValidation(e);
        }
    }

}

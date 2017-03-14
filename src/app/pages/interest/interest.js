import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import ContactInfo from '~/components/contact-info/contact-info';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {description as template} from './interest.html';

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
        this.contactInfoComponent = new ContactInfo(this.model);
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

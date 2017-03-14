import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import Popup from '~/components/popup/popup';
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
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
            },
            defaultTitle
        };
        this.regions = {
            popup: 'pop-up'
        };
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
        selectHandler.setup(this);
    }


    @on('click [type="submit"]')
    checkSchoolName(e) {
        const schoolName = this.el.querySelector('[name="company"]').value;

        if (this.askedAboutSchool !== schoolName && schoolName.length > 0 && schoolName.length < 5) {
            this.regions.popup.attach(new Popup('Please enter your full school name' +
            ' without abbreviations. If this is your full school name, you can hit Submit.'));
            this.askedAboutSchool = schoolName;
            e.preventDefault();
        } else {
            super.doCustomValidation(e);
        }
    }

}

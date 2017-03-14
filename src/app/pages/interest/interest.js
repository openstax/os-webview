import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import Popup from '~/components/popup/popup';
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
        this.regions = {
            popup: 'pop-up'
        };
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

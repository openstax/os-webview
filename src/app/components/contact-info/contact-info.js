import {Controller} from 'superb';
import Popup from '~/components/popup/popup';
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
    }

    checkSchoolName(e) {
        const schoolName = this.el.querySelector('[name="company"]').value;

        if (this.askedAboutSchool !== schoolName && schoolName.length > 0 && schoolName.length < 5) {
            this.regions.popup.attach(new Popup('Please enter your full school name' +
            ' without abbreviations. If this is your full school name, you can hit Submit.'));
            this.askedAboutSchool = schoolName;
            e.preventDefault();
            e.stopPropagation();
            return true;
        }
        return false;
    }

}

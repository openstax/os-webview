import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import selectHandler from '~/handlers/select';
import salesforce from '~/models/salesforce';
import {sfUserModel} from '~/models/usermodel';
import {description as template} from './faculty-section.html';

export default class FacultySection extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.model.adoptionOptions = salesforce.adoption(['adopted', 'recommended', 'no']);
    }

    onLoaded() {
        selectHandler.setup(this);
    }

    @on('change [name="00NU0000005oVQV"]')
    testInstitutionalEmail(event) {
        const el = event.delegateTarget;
        const isValid = $.testInstitutionalEmail(el);

        el.setCustomValidity(isValid ? '' : 'We cannot verify a generic email address');

        const sfResponse = sfUserModel.load({email: event.target.value});

        sfResponse.then((user) => {
            this.model.emailPreviouslyUsed = user.salesforce_email_previously_used;
            this.update();
        });
    }

}

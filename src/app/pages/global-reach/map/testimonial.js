import {Controller} from 'superb.js';
import {description as template} from './testimonial.html';
import {on} from '~/helpers/controller/decorators';
import TestimonialForm from './testimonial-form';
import {accountsModel} from '~/models/usermodel';
import settings from 'settings';

export default class extends Controller {

    init(props) {
        this.template = template;
        this.view = {
            classes: ['toggle-datalist-body']
        };
        this.model = props;
        this.model.login = `${settings.apiOrigin}/oxauth/login/?next=` +
            `${encodeURIComponent(window.location.href)}`;
        accountsModel.load().then((info) => {
            try {
                this.accountInfo = {
                    role: info.self_reported_role,
                    email: (info.contact_infos || [])
                        .filter((i) => i.is_verified)
                        .reduce((a, b) => (a.is_guessed_preferred ? a : b), {})
                        .value,
                    school: info.self_reported_school,
                    firstName: info.first_name,
                    lastName: info.last_name
                };
                this.model.loggedIn = true;
                this.update();
            } catch (e) {
                console.log(e);
            }
        });
    }
    @on('click .sub-testimonial')
    showTestimonialForm(event) {
        const form = new TestimonialForm(this.accountInfo);

        form.show();
        event.preventDefault();
    }

}

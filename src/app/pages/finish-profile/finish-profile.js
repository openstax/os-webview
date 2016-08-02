import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
// import salesforceModel from '~/models/salesforce-model';
// import userModel from '~/models/usermodel';
import FacultySection from './faculty-section/faculty-section';
import {description as template} from './finish-profile.html';

export default class NewAccountForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/finish-profile/finish-profile.css';
        this.view = {
            tag: 'footer',
            classes: ['finish-profile', 'page']
        };
        this.regions = {
            facultySection: '#faculty-section' // FIX: Don't use IDs
        };
        this.templateHelpers = {
            bookTitles,
            roles: ['Faculty', 'Adjunct Faculty', 'Administrator', 'Librarian',
            'Instructional Designer', 'Student', 'Other']
        };
    }

    onLoaded() {
        selectHandler.setup(this);
    }

    /*
    @on('click #toggle-faculty')
    clickFaculty(event) {
        this.toggleFaculty(event.currentTarget.checked);
    }

    // FIX: Move all DOM manipulation to template
    toggleFaculty(show) {
        const retUrl = this.el.querySelector('[name=retURL]');
        const leadType = show ? 'OSC Faculty' : 'OSC User';
        const leadSourceField = this.el.querySelector('[name="lead_source"]');

        if (show) {
            this.facultySection.setRequiredness(true);
            this.regions.facultySection.attach(this.facultySection);
            this.el.querySelector('form').classList.add('faculty');
            retUrl.value = `${window.location.origin}/confirmation?faculty`;
        } else {
            this.facultySection.setRequiredness(false);
            this.facultySection.remove();
            this.el.querySelector('form').classList.remove('faculty');
            retUrl.value = `${window.location.origin}/confirmation?unverified`;
        }
        leadSourceField.value = leadType;
    }

    onLoaded() {
        this.facultySection = new FacultySection();
        salesforceModel.prefill(this.el);
        // FIX: Model should be separate from controller
        userModel.fetch().then((data) => {
            const userInfo = data[0];

            if (userInfo && userInfo.username && userInfo.accounts_id) {
                this.el.querySelector('[name=first_name]').value = userInfo.first_name;
                this.el.querySelector('[name=last_name]').value = userInfo.last_name;
                this.el.querySelector('[name=user_id]').value = userInfo.username;
                this.el.querySelector('[name=OS_Accounts_ID__c]').value = userInfo.accounts_id;
            } else {
                this.el.querySelector('#problem-message').textContent = 'Could not load user information';
                this.el.querySelector('[type="submit"]').disabled = true;
            }
        }).catch((e) => {
            /* eslint no-alert: 0 */
            // alert('Something went wrong. Cannot find your user information.');
            /* eslint no-console: 0 */
            // console.warn(e);
            // window.location.pathname = '/';
        // });

        /*
        const roleSelector = this.el.querySelector('[name="00NU00000054MLz"]');
        const roleProxy = this.findProxyFor(roleSelector);
        const facultyCheckbox = document.getElementById('toggle-faculty');

        // FIX: Collection should be separate from controller
        roleProxy.stateCollection.on('change:selected', (what) => {
            const isStudent = what.get('value') === 'Student';

            facultyCheckbox.disabled = isStudent;
            facultyCheckbox.checked = !isStudent;
            this.toggleFaculty(facultyCheckbox.checked);
        });
    }
    */

}

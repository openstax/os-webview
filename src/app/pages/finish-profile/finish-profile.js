import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {sfUserModel} from '~/models/usermodel';
import FacultySection from './faculty-section/faculty-section';
import {description as template} from './finish-profile.html';

export default class NewAccountForm extends SalesforceForm {

    init() {
        super.init();
        this.template = template;
        this.css = '/app/pages/finish-profile/finish-profile.css';
        this.view = {
            classes: ['finish-profile', 'page']
        };
        this.regions = {
            facultySection: '[data-region="faculty-section"]'
        };

        this.model = {
            roles: ['Faculty', 'Adjunct Faculty', 'Administrator', 'Librarian',
            'Instructional Designer', 'Student', 'Other'],
            leadType: 'OSC User',
            validationMessage: (name) =>
                this.hasBeenSubmitted ?
                ((el) => el ? el.validationMessage : '')(this.el.querySelector(`[name="${name}"]`)) :
                '',
            problemMessage: 'Loading user info',
            facultyCheckboxAvailable: true
        };
    }

    onLoaded() {
        document.title = 'Finish Profile - OpenStax';
        selectHandler.setup(this);
        this.sfUserModelLoaded = sfUserModel.load();
        this.sfUserModelLoaded.then((user) => {
            this.model.firstName = user.first_name;
            this.model.lastName = user.last_name;
            this.model.userId = user.username;
            this.model.accountId = user.accounts_id;
            if (!user.accounts_id) {
                this.model.problemMessage = 'Could not load user information';
            } else {
                this.model.problemMessage = '';
            }
            this.update();
            this.formResponseEl = this.el.querySelector('#form-response');
            this.goToConfirmation = () => {
                if (this.submitted) {
                    this.submitted = false;
                    router.navigate(`/confirmation?${this.model.returnTo}`);
                }
            };
            this.formResponseEl.addEventListener('load', this.goToConfirmation);
        });
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.sfUserModelLoaded.then(() => {
            this.model.titles = this.salesforceTitles;
            this.update();
            selectHandler.setup(this);
        });
    }

    onUpdate() {
        if (this.regions.facultySection.controllers) {
            for (const c of this.regions.facultySection.controllers) {
                c.update();
            }
        }
    }

    setFacultySection(whether) {
        if (whether) {
            this.regions.facultySection.attach(new FacultySection(this.model));
            this.model.leadType = 'OSC Faculty';
            this.model.returnTo = 'faculty';
        } else {
            this.regions.facultySection.empty();
            this.model.leadType = 'OSC User';
            this.model.returnTo = 'unverified';
        }
    }

    @on('change [name="00NU00000054MLz"]')
    updateFaculty(event) {
        const role = event.delegateTarget.value;
        const doFaculty = role !== '' && role !== 'Student';
        const toggling = doFaculty !== this.model.facultyCheckboxAvailable;

        if (toggling) {
            this.model.facultyCheckboxAvailable = doFaculty;
            this.model.facultyCheckboxChecked = doFaculty;
            this.setFacultySection(doFaculty);
            this.update();
        }
    }

    @on('click #toggle-faculty')
    clickFaculty(event) {
        const checked = event.delegateTarget.checked;

        this.setFacultySection(checked);
        this.update();
    }

}

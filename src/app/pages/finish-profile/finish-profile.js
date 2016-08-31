import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
import {sfUserModel} from '~/models/usermodel';
import FacultySection from './faculty-section/faculty-section';
import {description as template} from './finish-profile.html';

export default class NewAccountForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/finish-profile/finish-profile.css';
        this.view = {
            classes: ['finish-profile', 'page']
        };
        this.regions = {
            facultySection: '[data-region="faculty-section"]'
        };
        const titles = bookTitles.map((titleData) =>
            titleData.text ? titleData : {
                text: titleData,
                value: titleData
            }
        );

        this.model = {
            titles,
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
        sfUserModel.load().then((user) => {
            this.model.firstName = user.first_name;
            this.model.lastName = user.last_name;
            this.model.userId = user.username;
            this.model.accountId = user.accounts_id;
            if (user.accounts_id === null) {
                this.model.problemMessage = 'Could not load user information';
            } else {
                this.model.problemMessage = '';
            }
            this.update();
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

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalid = this.el.querySelector('form:invalid');

        this.hasBeenSubmitted = true;
        if (invalid) {
            event.preventDefault();
            this.update();
        }
    }

    @on('change')
    updateOnChange() {
        this.update();
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

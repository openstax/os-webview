import BaseView from '~/helpers/backbone/view';
import UserModel from '~/models/usermodel';
import bookTitles from '~/helpers/book-titles';
import SingleSelect from '~/components/single-select/single-select';
import TagMultiSelect from '~/components/tag-multi-select/tag-multi-select';
import FacultySection from './faculty-section/faculty-section';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './finish-profile.hbs';

@props({
    template: template,
    templateHelpers: {
        bookTitles,
        urlOrigin: `${window.location.origin}/finished-no-verify`,
        roles: ['Faculty', 'Adjunct Faculty', 'Administrator', 'Librarian',
        'Instructional Designer', 'Student', 'Other']
    },
    regions: {
        facultySection: '#faculty-section'
    }
})
export default class NewAccountForm extends BaseView {
    @on('click #toggle-faculty')
    toggleFaculty(event) {
        let retUrl = this.el.querySelector('[name=retURL]');

        if (event.target.checked) {
            this.regions.facultySection.show(this.facultySection);
            retUrl.value = `${window.location.origin}/finished-verify`;
        } else {
            this.facultySection.remove();
            retUrl.value = `${window.location.origin}/finished-no-verify`;
        }
    }

    failIfInvalid(event) {
        for (let widget of this.selectWidgets) {
            widget.doValidChecks();
        }
        let invalid = this.el.querySelectorAll('.invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    onRender() {
        this.facultySection = new FacultySection();
        this.el.classList.add('finish-profile');
        new UserModel().fetch().then((data) => {
            let userInfo = data[0];

            this.el.querySelector('[name=first_name]').value = userInfo.first_name;
            this.el.querySelector('[name=last_name]').value = userInfo.last_name;
            this.el.querySelector('[name=user_id]').value = userInfo.username;
        }).catch(() => {
            /* eslint no-alert: 0 */
            alert('Something went wrong. Cannot find your user information.');
            window.location.pathname = '/';
        });
        this.selectWidgets = [];
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            let widget = new SingleSelect();

            widget.replace(ss);
            this.selectWidgets.push(widget);
        }
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            let widget = new TagMultiSelect();

            widget.replace(ms);
            this.selectWidgets.push(widget);
        }
        this.el.querySelector('[type=submit]').addEventListener('click', this.failIfInvalid.bind(this));
    }

    onBeforeClose() {
        this.el.querySelector('[type=submit]').removeEventListener('click', this.failIfInvalid.bind(this));
    }
}

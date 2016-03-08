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

    onRender() {
        this.facultySection = new FacultySection();
        this.el.classList.add('text-content', 'finish-profile');
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
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            new SingleSelect().replace(ss);
        }
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            new TagMultiSelect().replace(ms);
        }
    }
}

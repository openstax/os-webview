import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import userModel from '~/models/usermodel';
import bookTitles from '~/helpers/book-titles';
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
export default class NewAccountForm extends ProxyWidgetView {
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
        this.el.classList.add('finish-profile');
        super.onRender();
        userModel.fetch().then((data) => {
            let userInfo = data[0];

            if (userInfo) {
                this.el.querySelector('[name=first_name]').value = userInfo.first_name;
                this.el.querySelector('[name=last_name]').value = userInfo.last_name;
                this.el.querySelector('[name=user_id]').value = userInfo.username;
                this.el.querySelector('[name=Accounts_ID]').value = userInfo.accounts_id;
            } else {
                this.el.querySelector('#problem-message').textContent = 'Could not load user information';
                this.el.querySelector('[type="submit"]').disabled = true;
            }
        }).catch(() => {
            /* eslint no-alert: 0 */
            alert('Something went wrong. Cannot find your user information.');
            window.location.pathname = '/';
        });
    }
}

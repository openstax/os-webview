import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import userModel from '~/models/usermodel';
import salesforceModel from '~/models/salesforce-model';
import bookTitles from '~/helpers/book-titles';
import FacultySection from './faculty-section/faculty-section';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './finish-profile.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    css: '/app/pages/finish-profile/finish-profile.css',
    templateHelpers: {
        bookTitles,
        urlOrigin: `${window.location.origin}/finished-no-verify`,
        roles: ['Faculty', 'Adjunct Faculty', 'Administrator', 'Librarian',
        'Instructional Designer', 'Student', 'Other'],
        strips
    },
    regions: {
        facultySection: '#faculty-section'
    }
})
export default class NewAccountForm extends ProxyWidgetView {

    @on('click #toggle-faculty')
    clickFaculty(event) {
        this.toggleFaculty(event.currentTarget.checked);
    }

    toggleFaculty(show) {
        let retUrl = this.el.querySelector('[name=retURL]'),
            leadType = show ? 'OSC Faculty' : 'OSC User',
            leadSourceField = this.el.querySelector('[name="lead_source"]');

        if (show)  {
            this.regions.facultySection.show(this.facultySection);
            this.el.querySelector('form').classList.add('faculty');
            retUrl.value = `${window.location.origin}/finished-verify`;
        } else {
            this.facultySection.remove();
            this.el.querySelector('form').classList.remove('faculty');
            retUrl.value = `${window.location.origin}/finished-no-verify`;
        }
        leadSourceField.value = leadType;
    }

    onRender() {
        this.facultySection = new FacultySection();
        this.el.classList.add('finish-profile');
        super.onRender();
        salesforceModel.prefill(this.el);
        userModel.fetch().then((data) => {
            let userInfo = data[0];

            if (userInfo) {
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
            alert('Something went wrong. Cannot find your user information.');
            /* eslint no-console: 0 */
            console.warn(e);
            // window.location.pathname = '/';
        });

        let roleSelector = this.el.querySelector('[name="00NU00000054MLz"]'),
            roleProxy = this.findProxyFor(roleSelector),
            facultyCheckbox = document.getElementById('toggle-faculty');

        roleProxy.stateCollection.on('change:selected', (what) => {
            let isStudent = what.get('value') === 'Student';

            facultyCheckbox.disabled = isStudent;
            facultyCheckbox.checked = !isStudent;
            this.toggleFaculty(facultyCheckbox.checked);
        });
    }

}

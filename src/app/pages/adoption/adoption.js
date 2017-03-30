import {Controller} from 'superb';
import $ from '~/helpers/$';
import settings from 'settings';
import {on} from '~/helpers/controller/decorators';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import ManagedComponent from '~/helpers/controller/managed-component';
import StudentForm from './student-form/student-form';
import TeacherForm from './teacher-form/teacher-form';
import salesforce from '~/models/salesforce';
import {description as template} from './adoption.html';

const headerInfoPromise = fetch(`${settings.apiOrigin}/api/pages/adoption-form`)
.then((r) => r.json());

export default class AdoptionForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/adoption/adoption.css';
        this.view = {
            classes: ['adoption-page', 'page']
        };
        this.regions = {
            roleSelector: 'component[data-id="selectedRole"]',
            form: 'component[data-id="form"]'
        };
        this.form = null;
        this.model = {};
        // const defaultTitle = decodeURIComponent(window.location.search.substr(1));
    }

    onLoaded() {
        document.title = 'Adoption Form - OpenStax';
        headerInfoPromise.then((response) => {
            this.model.introHeading = response.intro_heading;
            this.model.introDescription = response.intro_description;
            this.update();
            $.insertHtml(this.el, this.model);
        });
        this.regions.roleSelector.attach(new FormSelect({
            placeholder: 'I am a',
            validationMessage: () => '',
            options: salesforce.userRoles.map((opt) => ({label: opt, value: opt}))
        }));
    }

    @on('change [data-id="selectedRole"] select')
    updateSelectedRole(event) {
        const newRole = event.target.value;
        const oldRole = this.model.selectedRole;

        if (!newRole) {
            return;
        }
        this.model.selectedRole = newRole;
        if (newRole === 'Student') {
            this.form = new StudentForm();
            this.regions.form.attach(this.form);
        } else if (newRole && (!oldRole || oldRole === 'Student')) {
            this.form = new TeacherForm(this.model);
            this.regions.form.attach(this.form);
        }
        this.form.update();
    }

}

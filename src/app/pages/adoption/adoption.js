import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import settings from 'settings';
import FormSelect from '~/components/form-select/form-select';
import StudentForm from '~/components/student-form/student-form';
import TeacherForm from './teacher-form/teacher-form';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './adoption.html';

const headerInfoPromise = fetch(`${settings.apiOrigin}/api/pages/adoption-form`)
    .then((r) => r.json());

const rolesPromise = fetch(`${settings.apiOrigin}/api/snippets/roles`)
    .then((r) => r.json());

export default class AdoptionForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/adoption/adoption.css';
        this.view = {
            classes: ['adoption-page', 'page']
        };
        this.regions = {
            roleSelector: 'plug-in[data-id="selectedRole"]',
            form: 'plug-in[data-id="form"]'
        };
        this.form = null;
        this.model = {};
    }

    onLoaded() {
        document.title = 'Adoption Form - OpenStax';
        // Pardot tracking
        if ('piTracker' in window) {
            piTracker(window.location.href.split('#')[0]);
        }
        headerInfoPromise.then((response) => {
            this.model.introHeading = response.intro_heading;
            this.model.introDescription = response.intro_description;
            this.update();
            $.insertHtml(this.el, this.model);
        });
        rolesPromise.then((roles) => {
            const options = roles.map((opt) => ({label: opt.display_name, value: opt.salesforce_name}));

            this.regions.roleSelector.attach(new FormSelect({
                placeholder: 'Please select one',
                validationMessage: () => '',
                instructions: 'I am a',
                options
            }));
        });
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
            this.form = new StudentForm('http://go.pardot.com/l/218812/2017-04-06/l4sn');
            this.regions.form.attach(this.form);
        } else if (newRole && (!oldRole || oldRole === 'Student')) {
            this.form = new TeacherForm(this.model);
            this.regions.form.attach(this.form);
        }
        this.model.userRole = newRole;
        this.form.update();
        $.scrollTo(this.form.el);
    }

}

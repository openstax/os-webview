import {Controller} from 'superb';
import $ from '~/helpers/$';
import settings from 'settings';
import FormSelect from '~/components/form-select/form-select';
import StudentForm from '~/components/student-form/student-form';
import TeacherForm from './teacher-form/teacher-form';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './interest.html';

const headerInfoPromise = fetch(`${settings.apiOrigin}/api/pages/interest-form`)
.then((r) => r.json());

const rolesPromise = fetch(`${settings.apiOrigin}/api/snippets/roles`)
.then((r) => r.json());

export default class InterestForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/interest/interest.css';
        this.view = {
            classes: ['interest-form']
        };
        const defaultTitle = decodeURIComponent(window.location.search.substr(1));

        this.model = {
            validationMessage: (name) =>
                this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : '',
            defaultTitle
        };
        this.regions = {
            roleSelector: 'component[data-id="selectedRole"]',
            form: 'component[data-id="form"]'
        };
    }

    onLoaded() {
        document.title = 'Interest Form - OpenStax';
        // Pardot tracking
        piTracker(window.location.href.split('#')[0]);
        headerInfoPromise.then((response) => {
            this.model.introHeading = response.intro_heading;
            this.model.introDescription = response.intro_description;
            this.update();
            $.insertHtml(this.el, this.model);
        });
        rolesPromise.then((roles) => {
            const options = roles.map((opt) => ({label: opt.name, value: opt.name}));

            this.regions.roleSelector.attach(new FormSelect({
                placeholder: 'I am a',
                validationMessage: () => '',
                options
            }));
        });
        /*
        TODO: MOVE TO TEACHER FORM
        this.formResponseEl = this.el.querySelector('#form-response');
        this.goToConfirmation = () => {
            if (this.submitted) {
                this.submitted = false;
                router.navigate('/interest-confirmation');
            }
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
        */
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
            this.form = new StudentForm('http://go.pardot.com/l/218812/2017-04-11/ld9g');
            this.regions.form.attach(this.form);
        } else if (newRole && (!oldRole || oldRole === 'Student')) {
            this.form = new TeacherForm(this.model);
            this.regions.form.attach(this.form);
        }
        this.model.userRole = newRole;
        this.form.update();
    }

}

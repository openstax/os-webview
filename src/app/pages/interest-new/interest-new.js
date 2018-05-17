import VERSION from '~/version';
import {Controller} from 'superb.js';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import ContactInfo from '~/components/contact-info/contact-info';
import BookSelector from '~/components/book-selector/book-selector';
import SeriesOfComponents from '~/components/series-of-components/series-of-components';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import FormInput from '~/components/form-input/form-input';
import TechnologySelector from '~/components/technology-selector/technology-selector';
import {description as template} from './interest.html';

export default class InterestForm extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/interest-new/interest.css?${VERSION}`;
        this.view = {
            classes: ['interest-form-v2']
        };
        const defaultTitle = decodeURIComponent(window.location.search.substr(1));

        this.regions = {
            header: '[data-region="header"]',
            roleSelector: '[data-region="role-selector"]',
            form: 'plug-in[data-id="form"]'
        };
    }

    secondPage() {
        let validated = false;
        const validationMessage = function (name) {
            return this && validated ? this.el.querySelector(`[name="${name}"]`).validationMessage : '';
        };
        const bookSelector = new BookSelector(() => ({
            prompt: 'Which textbook(s) are you interested in adopting?',
            required: true
        }));
        const howManyStudents = new FormInput({
            name: '00NU00000052VId',
            longLabel: 'How many students do you teach each semester?',
            type: 'number',
            min: '1',
            required: true,
            validationMessage: (name) => validationMessage.bind(howManyStudents)(name)
        });
        const whichPartners = new FormCheckboxGroup({
            name: '00NU00000055spm',
            longLabel: 'Which of our partners would you like to give permission' +
            ' to contact you about additional resources to support our books?',
            instructions: 'Select all that apply.',
            options: [
                {label: 'Online homework partners', value: 'Online homework partners'},
                {label: 'Adaptive courseware partners', value: 'Adaptive courseware partners'},
                {label: 'Customization tool partners', value: 'Customization tool partners'}
            ],
            multiple: true,
            required: true,
            requireNone: true,
            validationMessage: (name) => validationMessage.bind(whichPartners)(name)
        });
        const howDidYouHear = new FormCheckboxGroup({
            name: '00NU00000055spr',
            longLabel: 'How did you hear about OpenStax?',
            instructions: 'Select all that apply.',
            options: [
                {value: 'Web search', label: 'Web search'},
                {value: 'Colleague', label: 'Colleague'},
                {value: 'Conference', label: 'Conference'},
                {value: 'Email', label: 'Email'},
                {value: 'Facebook', label: 'Facebook'},
                {value: 'Twitter', label: 'Twitter'},
                {value: 'Webinar', label: 'Webinar'},
                {value: 'Partner organization', label: 'Partner organization'}
            ],
            multiple: true,
            required: true,
            validationMessage: (name) => validationMessage.bind(howDidYouHear)(name)
        });
        const result = new SeriesOfComponents({
            className: 'page-2',
            contents: [
                bookSelector,
                howManyStudents,
                whichPartners,
                howDidYouHear
            ]
        });

        result.validate = function () {
            validated = true;
            const bsv = bookSelector.validate();

            bookSelector.update();
            result.update();

            return Boolean(bsv || result.el.querySelector(':invalid'));
        };
        return result;
    }

    onLoaded() {
        document.title = 'Interest Form - OpenStax';
        // Pardot tracking
        if ('piTracker' in window) {
            piTracker(window.location.href.split('#')[0]);
        }
        this.regions.header.attach(new FormHeader('pages/interest-form'));

        const studentForm = new StudentForm('http://go.pardot.com/l/218812/2017-04-11/ld9g');
        const secondPage = this.secondPage();
        const facultyPages = [
            new ContactInfo({
                validationMessage(name) {
                    return this.validated ? this.el.querySelector(`[name="${name}"]`).validationMessage : '';
                }
            }),
            secondPage,
            new TechnologySelector({
                prompt: 'Tell us about the technology you use.'
            })
        ];
        const facultyForm = new MultiPageForm(() => ({
            contents: facultyPages
        }));

        this.regions.roleSelector.attach(new RoleSelector(() => [
            {
                contents: studentForm,
                hideWhen: (role) => role !== 'Student'
            },
            {
                contents: facultyForm,
                hideWhen: (role) => ['', 'Student'].includes(role)
            }
        ]));
    }

}

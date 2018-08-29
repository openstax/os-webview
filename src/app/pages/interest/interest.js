import VERSION from '~/version';
import {Controller} from 'superb.js';
import BookSelector from '~/components/book-selector/book-selector';
import ContactInfo from '~/components/contact-info/contact-info';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import FormHeader from '~/components/form-header/form-header';
import FormInput from '~/components/form-input/form-input';
import HiddenFields from './hidden-fields/hidden-fields';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import RoleSelector from '~/components/role-selector/role-selector';
import router from '~/router';
import salesforce from '~/models/salesforce';
import SeriesOfComponents from '~/components/series-of-components/series-of-components';
import StudentForm from '~/components/student-form/student-form';
import TechnologySelector from '~/components/technology-selector/technology-selector';
import {description as template} from './interest.html';

export default class InterestForm extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/interest/interest.css?${VERSION}`;
        this.view = {
            classes: ['interest-form-v2'],
            tag: 'main'
        };
        this.regions = {
            header: '[data-region="header"]',
            roleSelector: '[data-region="role-selector"]'
        };
    }

    firstPage() {
        const contactForm = new ContactInfo({
            validationMessage(name) {
                return this.validated ? this.el.querySelector(`[name="${name}"]`).validationMessage : '';
            }
        });
        const result = new SeriesOfComponents({
            className: 'page-1',
            contents: [
                new HiddenFields(),
                contactForm
            ]
        });

        result.validate = function () {
            return contactForm.validate();
        };
        return result;
    }

    secondPage() {
        let validated = false;
        const validationMessage = function (name) {
            return this && validated ? this.el.querySelector(`[name="${name}"]`).validationMessage : '';
        };
        const bookSelector = new BookSelector(() => ({
            prompt: 'Which textbook(s) are you interested in adopting?',
            required: true,
            name: 'Subject__c',
            preselectedTitle: decodeURIComponent(window.location.search.substr(1))
        }));
        const howManyStudents = new FormInput({
            name: 'Number_of_Students__c',
            longLabel: 'How many students do you teach each semester?',
            type: 'number',
            min: '1',
            required: true,
            validationMessage: (name) => validationMessage.bind(howManyStudents)(name)
        });
        const whichPartners = new FormCheckboxGroup({
            name: 'Partner_Category_Interest__c',
            longLabel: 'Which of our partners would you like to give permission' +
            ' to contact you about additional resources to support our books?',
            instructions: 'Select all that apply (optional).',
            options: [
                {label: 'Online homework partners', value: 'Online homework partners'},
                {label: 'Adaptive courseware partners', value: 'Adaptive courseware partners'},
                {label: 'Customization tool partners', value: 'Customization tool partners'}
            ],
            validationMessage: (name) => validationMessage.bind(whichPartners)(name)
        });
        const howDidYouHear = new FormCheckboxGroup({
            name: 'How_did_you_Hear__c',
            longLabel: 'How did you hear about OpenStax?',
            instructions: 'Select all that apply (optional).',
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
        const facultyPages = [
            this.firstPage(),
            this.secondPage(),
            new TechnologySelector({
                prompt: 'Tell us about the technology you use.'
            })
        ];
        const facultyForm = new MultiPageForm(
            () => ({
                action: `https://${salesforce.salesforceHome}/servlet/servlet.WebToLead?encoding=UTF-8`,
                contents: facultyPages
            }),
            {
                onPageChange: this.onPageChange.bind(this),
                afterSubmit: () => {
                    router.navigate('/interest-confirmation');
                }
            }
        );

        this.roleSelector = new RoleSelector(() => [
            {
                contents: studentForm,
                hideWhen: (role) => role !== 'Student'
            },
            {
                contents: facultyForm,
                hideWhen: (role) => ['', 'Student'].includes(role)
            }
        ]);
        this.regions.roleSelector.attach(this.roleSelector);
    }

    onPageChange(pageNumber) {
        if (this.roleSelector) {
            this.roleSelector.isHidden = pageNumber > 0;
            this.roleSelector.update();
        }
    }

}

import VERSION from '~/version';
import {Controller} from 'superb.js';
import BookSelector from '~/components/book-selector/book-selector';
import ContactInfo from '~/components/contact-info/contact-info';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import FormHeader from '~/components/form-header/form-header';
import HiddenFields from './hidden-fields/hidden-fields';
import HowUsing from './how-using/how-using';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import RoleSelector from '~/components/role-selector/role-selector';
import router from '~/router';
import salesforce from '~/models/salesforce';
import SeriesOfComponents from '~/components/series-of-components/series-of-components';
import StudentForm from '~/components/student-form/student-form';
import TechnologySelector from '~/components/technology-selector/technology-selector';
import {description as template} from './adoption.html';

export default class InterestForm extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/adoption/adoption.css?${VERSION}`;
        this.view = {
            classes: ['adoption-form-v2']
        };
        const defaultTitle = decodeURIComponent(window.location.search.substr(1));

        this.regions = {
            header: '[data-region="header"]',
            roleSelector: '[data-region="role-selector"]',
            form: 'plug-in[data-id="form"]'
        };
        this.selectedBooks = [];
        this.usingInfo = {};
        this.disableHowUsing = false;
        this.currentBookInfo = {};
        this.hiddenFields = new HiddenFields(() => this.currentBookInfo);
        this.howUsing = new HowUsing(
            () => ({
                selectedBooks: this.selectedBooks,
                disable: this.disableHowUsing
            }),
            (newValue) => {
                this.usingInfo = newValue;
            }
        );
    }

    onLoaded() {
        document.title = 'Interest Form - OpenStax';
        // Pardot tracking
        if ('piTracker' in window) {
            piTracker(window.location.href.split('#')[0]);
        }
        this.regions.header.attach(new FormHeader('pages/adoption-form'));

        const studentForm = new StudentForm('http://go.pardot.com/l/218812/2017-04-11/ld9g');
        const firstPage = () => {
            const contactForm = new ContactInfo({
                validationMessage(name) {
                    return this.validated ? this.el.querySelector(`[name="${name}"]`).validationMessage : '';
                }
            });
            const result = new SeriesOfComponents({
                className: 'page-1',
                contents: [
                    this.hiddenFields,
                    contactForm
                ]
            });

            result.validate = function () {
                return contactForm.validate();
            };
            return result;
        };
        const secondPage = () => {
            const bookSelector = new BookSelector(
                () => ({
                    prompt: 'Which textbook(s) are you interested in adopting?',
                    required: true
                }),
                (selectedBooks) => {
                    this.selectedBooks = selectedBooks;
                    this.howUsing.update();
                }
            );
            const result = new SeriesOfComponents({
                className: 'page-2',
                contents: [
                    bookSelector,
                    this.howUsing
                ]
            });

            result.validate = () => {
                const bsv = bookSelector.validate();
                const huv = this.howUsing.validate();

                return bsv || huv;
            };
            return result;
        };
        const facultyPages = [
            firstPage(),
            secondPage(),
            new TechnologySelector({
                prompt: 'Tell us about the technology you use.'
            })
        ];
        const facultyForm = new MultiPageForm(
            () => ({
                action: `https://${salesforce.salesforceHome}/servlet/servlet.WebToLead?encoding=UTF-8`,
                contents: facultyPages
            }),
            this.onSubmit.bind(this),
            this.afterSubmit.bind(this)
        );

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

    onSubmit(event) {
        this.disableHowUsing = true;
        this.howUsing.update();
        const form = event.target;

        this.submitQueue = this.selectedBooks.map((b) => {
            return () => {
                this.currentBookInfo = {
                    book: b.value,
                    adoptionStatus: this.usingInfo.checked[b.value],
                    numberOfStudents: this.usingInfo.howMany[b.value]
                };
                this.hiddenFields.update();
                form.submit();
            };
        });
        this.afterSubmit();
    }

    afterSubmit() {
        if (this.submitQueue.length) {
            const action = this.submitQueue.shift();

            action();
        } else {
            const emailEl = document.querySelector('[name="email"]');

            router.navigate('/adoption-confirmation', {
                email: emailEl.value
            });
        }
    }

}

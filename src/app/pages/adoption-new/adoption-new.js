import VERSION from '~/version';
import {Controller} from 'superb.js';
import BookSelector from '~/components/book-selector/book-selector';
import ContactInfo from '~/components/contact-info/contact-info';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import FormHeader from '~/components/form-header/form-header';
import HowUsing from './how-using/how-using';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import RoleSelector from '~/components/role-selector/role-selector';
import SeriesOfComponents from '~/components/series-of-components/series-of-components';
import StudentForm from '~/components/student-form/student-form';
import TechnologySelector from '~/components/technology-selector/technology-selector';
import {description as template} from './adoption.html';

export default class InterestForm extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/adoption-new/adoption.css?${VERSION}`;
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
    }

    onLoaded() {
        document.title = 'Interest Form - OpenStax';
        // Pardot tracking
        if ('piTracker' in window) {
            piTracker(window.location.href.split('#')[0]);
        }
        this.regions.header.attach(new FormHeader('pages/adoption-form'));

        const studentForm = new StudentForm('http://go.pardot.com/l/218812/2017-04-11/ld9g');
        const howUsing = new HowUsing(() => ({
            selectedBooks: this.selectedBooks
        }));
        const bookSelector = new BookSelector(
            () => ({
                prompt: 'Which textbook(s) are you interested in adopting?',
                required: true
            }),
            (selectedBooks) => {
                this.selectedBooks = selectedBooks;
                howUsing.update();
            }
        );
        const secondPage = new SeriesOfComponents({
            className: 'page-2',
            contents: [
                bookSelector,
                howUsing
            ]
        });

        secondPage.validate = function () {
            const bsv = bookSelector.validate();
            const huv = howUsing.validate();

            return bsv || huv;
        };
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

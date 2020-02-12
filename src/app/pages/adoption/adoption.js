import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import BookSelector from '~/components/book-selector/book-selector';
import ContactInfo from '~/components/contact-info/contact-info';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import FormHeader from '~/components/form-header/form-header';
import HiddenFields from './hidden-fields/hidden-fields';
import HowUsing from './how-using/how-using';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import RoleSelector from '~/components/role-selector/role-selector';
import routerBus from '~/helpers/router-bus';
import salesforce from '~/models/salesforce';
import SeriesOfComponents from '~/components/series-of-components/series-of-components';
import StudentForm from '~/components/student-form/student-form';
import {description as template} from './adoption.html';
import css from './adoption.css';

const spec = {
    template,
    css,
    view: {
        classes: ['adoption-form-v2'],
        tag: 'main'
    },
    regions: {
        header: '[data-region="header"]',
        roleSelector: '[data-region="role-selector"]'
    }
};

export default class AdoptionForm extends componentType(spec, canonicalLinkMixin) {

    init() {
        super.init();
        const defaultTitle = decodeURIComponent(window.location.search.substr(1));

        this.selectedBooks = [];
        this.usingInfo = {};
        this.disableHowUsing = false;
        this.currentBookInfo = {};
        this.hiddenFields = new HiddenFields(
            () => Object.assign({
                role: this.roleSelector ? this.roleSelector.selectedRole : 'none selected'
            }, this.currentBookInfo)
        );
        this.howUsing = new HowUsing(
            () => ({
                selectedBooks: this.selectedBooks,
                disable: this.disableHowUsing
            }),
            (newValue) => {
                this.usingInfo = newValue;
            }
        );
        this.setCanonicalLink('/adoption');
    }

    onLoaded() {
        document.title = 'Adoption Form - OpenStax';
        // Pardot tracking
        if ('piTracker' in window) {
            piTracker(window.location.href.split('#')[0]);
        }
        this.regions.header.attach(new FormHeader('pages/adoption-form'));

        const studentForm = new StudentForm();
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
                return contactForm.checkSchoolName() || contactForm.validate();
            };
            return result;
        };
        const secondPage = () => {
            const bookSelector = new BookSelector({
                prompt: 'Which textbook(s) are you currently using?',
                required: true,
                preselectedTitle: decodeURIComponent(window.location.search.substr(1))
            });
            const result = new SeriesOfComponents({
                className: 'page-2',
                contents: [
                    bookSelector,
                    this.howUsing
                ]
            });

            bookSelector.on('change', (selectedBooks) => {
                this.selectedBooks = selectedBooks;
                this.howUsing.update();
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
            secondPage()
        ];
        const facultyForm = new MultiPageForm(
            () => ({
                action: salesforce.webtoleadUrl,
                contents: facultyPages
            }),
            {
                onPageChange: this.onPageChange.bind(this),
                onSubmit: this.onSubmit.bind(this),
                afterSubmit: this.afterSubmit.bind(this)
            }
        );

        this.roleSelector = new RoleSelector(
            () => [
                {
                    contents: studentForm,
                    hideWhen: (role) => role !== 'Student'
                },
                {
                    contents: facultyForm,
                    hideWhen: (role) => ['', 'Student'].includes(role)
                }
            ]
        );
        this.roleSelector.on('change', () => {
            this.hiddenFields.update();
        });
        this.regions.roleSelector.attach(this.roleSelector);
    }

    onPageChange(pageNumber) {
        if (this.roleSelector) {
            this.roleSelector.isHidden = pageNumber > 0;
            this.roleSelector.update();
        }
    }

    onSubmit(event) {
        this.disableHowUsing = true;
        this.howUsing.update();
        const form = event.target;

        this.submitQueue = this.selectedBooks.map((b, i) => {
            return () => {
                this.currentBookInfo = {
                    book: b.value,
                    adoptionStatus: this.usingInfo.checked[b.value],
                    numberOfStudents: this.usingInfo.howMany[b.value],
                    isFirst: i === 0 ? '1' : '0'
                };
                this.hiddenFields.update();
                form.submit();
            };
        });
        this.afterSubmit();
    }

    afterSubmit() {
        if (this.submitQueue && this.submitQueue.length) {
            const action = this.submitQueue.shift();

            // Ensure a little break between submissions
            setTimeout(action, 300);
        } else {
            const emailEl = document.querySelector('[name="email"]');

            setTimeout(() => {
                routerBus.emit('navigate', '/adoption-confirmation', {
                    email: emailEl.value
                });
            }, 300);
        }
    }

}

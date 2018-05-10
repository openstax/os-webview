import SalesforceForm from '~/controllers/salesforce-form';
import salesforce from '~/models/salesforce';
import router from '~/router';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import FormCheckboxGroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import ManagedComponent from '~/helpers/controller/managed-component';
import ContactInfo from '~/components/contact-info/contact-info';
import partnerPromise from '~/models/partners';
import {description as template} from './teacher-form.html';

export default class TeacherForm extends SalesforceForm {

    init(model) {
        super.init();
        this.template = template;
        this.view = {
            classes: ['labeled-inputs', 'row', 'top-of-form']
        };
        this.regions = {
            contactInfo: '[data-id="contactInfo"]',
            partnerCheckboxes: '.partner-checkboxes'
        };
        this.defaultTitle = decodeURIComponent(window.location.search.substr(1));
        const validationMessage = (name) => {
            const field = this.el && this.el.querySelector(`[name="${name}"]`);

            if (this.model && this.model.hasBeenSubmitted && field) {
                return field.validationMessage;
            }
            return '';
        };

        this.model = Object.assign(model, {
            validationMessage,
            salesforce,
            currentSection: 1,
            showOtherBlank: false,
            defaultTitle: this.defaultTitle,
            bookIsSelected: {},
            selectedBooks: () => this.selectedBooks(),
            validationMessageFromSelector: (selector) => {
                const el = this.el.querySelector(selector);

                if (el && this.model.hasBeenSubmitted) {
                    return el.validationMessage;
                }
                return '';
            }
        });
    }

    setBookOptions() {
        this.model.subjects = Array.from(new Set(this.salesforceTitles.map((book) => book.subject))).sort();
        this.model.booksBySubject = (subject) =>
            this.salesforceTitles
                .filter((b) => b.subject === subject)
                .sort()
                .reduce((a, b) => b.value === a.value ? a : a.concat(b), [])
        ;
    }

    onLoaded() {
        this.model.titles = this.salesforceTitles;
        partnerPromise.then((partners) => {
            const options = partners.map((p) => p.title)
                .sort((a, b) => a.localeCompare(b))
                .map((title) => ({
                    label: title,
                    value: title
                }));

            options.push({
                label: 'Other (specify below)',
                value: 'other-partner',
                onChange: (selected) => {
                    this.model.showOtherBlank = selected;
                    this.update();
                }
            });
            options.forEach(({label, value, onChange}) => {
                const cb = new BookCheckbox(() => ({
                    name: '00NU0000005VmTu',
                    value,
                    label
                }), onChange);

                this.regions.partnerCheckboxes.append(cb);
            });
        });
        this.contactInfo = new ContactInfo(this.model);
        this.regions.contactInfo.attach(this.contactInfo);
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.setBookOptions();
        this.update();
        this.setUpSubmissionQueue();
        const checkboxSubjectSections = this.el.querySelectorAll('[data-subject]');
        const Region = this.regions.self.constructor;

        for (const subjectEl of checkboxSubjectSections) {
            const subject = subjectEl.getAttribute('data-subject');
            const containers = Array.from(subjectEl.querySelectorAll('[data-book-checkbox]'));
            const books = this.model.booksBySubject(subject);

            for (let i=0; i<containers.length; ++i) {
                const cEl = containers[i];
                const book = books[i];
                const onChange = (checked) => {
                    this.model.bookIsSelected[book.value] = checked;
                    this.update();
                };
                const checkboxComponent = new BookCheckbox(() => ({
                    // No name; will provide name at submit time as needed
                    id: '00NU00000053nzR',
                    value: book.value,
                    imageUrl: book.coverUrl,
                    label: book.text
                }), onChange);
                const region = new Region(cEl, this);

                region.attach(checkboxComponent);
            }
        }
    }

    setUpSubmissionQueue() {
        this.formResponseEl = this.el.querySelector('#form-response');
        this.submissionQueue = [];
        this.submissionQueue.nextSubmission = () => {
            if (this.submissionQueue.length > 0) {
                const doSubmit = this.submissionQueue.shift();

                doSubmit();
            } else {
                const emailEl = document.querySelector('[name="email"]');

                router.navigate('/adoption-confirmation', {
                    email: emailEl.value
                });
            }
        };

        this.formResponseEl.addEventListener('load', this.submissionQueue.nextSubmission);
    }

    onClose() {
        this.formResponseEl.removeEventListener('load', this.submissionQueue.nextSubmission);
    }

    onUpdate() {
        if (this.parent) {
            this.parent.update();
        }
        this.contactInfo && this.contactInfo.update();
    }

    selectedBooks() {
        return this.model ?
            Object.keys(this.model.bookIsSelected)
                .filter((b) => this.model.bookIsSelected[b]) :
            [];
    }

    @on('click button.next')
    nextSection(event) {
        const invalid = super.doCustomValidation(event);

        this.model.hasBeenSubmitted = true;
        if (invalid) {
            this.update();
            return;
        }

        if (this.model.currentSection === 2 && this.selectedBooks().length < 1) {
            this.update();
            return;
        }

        if (!this.contactInfo.checkSchoolName() && this.model.currentSection < 4) {
            this.model.currentSection += 1;
            event.preventDefault();
            this.model.hasBeenSubmitted = false;
            this.update();
            $.scrollTo(this.el);
        }
    }

    @on('click button.back')
    previousSection(event) {
        this.model.currentSection -= 1;
        this.update();
        $.scrollTo(this.el);
        event.preventDefault();
    }

    @on('submit form')
    submitViaQueue(event) {
        event.preventDefault();
        this.model.submitting = true;
        this.update();

        const selectedBooks = this.selectedBooks();
        const bookEl = this.el.querySelector('[name="00NU00000053nzR"]');
        const howUsingEl = this.el.querySelector('[name="00NU00000055spw"]');

        for (const selectedBook of selectedBooks) {
            const selector = `[name="00NU00000055spw${selectedBook}"]:checked`;
            const howUsingSource = this.el.querySelector(selector);

            this.submissionQueue.push(() => {
                bookEl.value = selectedBook;
                howUsingEl.value = howUsingSource.value;
                event.target.submit();
            });
            // So it is not included in the form submission
            howUsingSource.disabled = true;
        }
        this.submissionQueue.nextSubmission();
    }

    doCustomValidation(event) {
        super.doCustomValidation(event);
        this.contactInfo.update();
    }

}

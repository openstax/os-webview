import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import cmsMixin from '~/helpers/controller/cms-mixin';
import salesforceFormMixin from '~/helpers/controller/salesforce-form-mixin';
import salesforce from '~/models/salesforce';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import {description as template} from './book-selector.html';
import css from './book-selector.css';

const spec = {
    template,
    css,
    view: {
        classes: ['book-selector']
    },
    model() {
        return {
            prompt: this.props.prompt,
            subjects: this.subjects,
            booksBySubject: this.booksBySubject,
            validationMessage: this.validationMessage
        };
    }
};

export default class BookSelector extends componentType(spec, cmsMixin, salesforceFormMixin, busMixin) {

    init(props) {
        super.init();
        this.props = props;
        this.subjects = [];
        this.salesforceTitles = [];
        this.booksBySubject = (subject) =>
            this.salesforceTitles
                .filter((b) => b.subjects.includes(subject))
        ;
        this.booksSorted = () =>
            this.salesforceTitles.slice().sort((a, b) => {
                const subA = this.subjects.indexOf(a.subject);
                const subB = this.subjects.indexOf(b.subject);
                const indA = this.salesforceTitles.findIndex((t) => t.value === a.value);
                const indB = this.salesforceTitles.findIndex((t) => t.value === b.value);

                if (subA < subB) {
                    return -1;
                }
                if (subA > subB) {
                    return 1;
                }
                if (indA < indB) {
                    return -1;
                }
                return 1; // They won't be equal
            });
        this.bookIsSelected = {};
        this.validated = false;
    }

    get selectedBooks() {
        return this.booksSorted()
            .filter((b) => Boolean(this.bookIsSelected[b.value]));
    }

    onDataLoaded() {
        super.onDataLoaded();
        const subjects = this.salesforceTitles.reduce((a, b) => a.concat(b.subjects), []);

        this.subjects = subjects.reduce((a, b) => a.includes(b) ? a : a.concat(b), []);
        this.update();

        const Region = this.regions.self.constructor;
        const checkboxSubjectSections = this.el.querySelectorAll('[data-subject]');

        for (const subjectEl of checkboxSubjectSections) {
            const subject = subjectEl.getAttribute('data-subject');
            const containers = Array.from(subjectEl.querySelectorAll('[data-book-checkbox]'));
            const books = this.booksBySubject(subject);

            for (let i=0; i<containers.length; ++i) {
                const cEl = containers[i];
                const book = books[i];
                const onChange = (checked) => {
                    this.bookIsSelected[book.value] = checked;
                    this.emit('change', this.selectedBooks);
                    this.update();
                };
                const checkboxComponent = new BookCheckbox(() => ({
                    name: this.props.name,
                    value: book.value,
                    imageUrl: book.coverUrl,
                    label: book.text
                }), onChange);
                const region = new Region(cEl, this);

                region.attach(checkboxComponent);
                if (book.value === this.props.preselectedTitle) {
                    checkboxComponent.toggleChecked();
                }
            }
        }
    }

    validate() {
        this.validated = true;
        this.update();
        return Boolean(this.validationMessage);
    }

    get validationMessage() {
        if (this.validated && this.props.required && this.selectedBooks.length === 0) {
            return 'Please select at least one book';
        }
        return '';
    }

}

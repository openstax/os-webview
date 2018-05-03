import VERSION from '~/version';
import SalesforceForm from '~/controllers/salesforce-form';
import salesforce from '~/models/salesforce';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import $ from '~/helpers/$';
import {description as template} from './book-selector.html';

export default class BookSelector extends SalesforceForm {

    init(getProps) {
        super.init();
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['book-selector']
        };
        this.css = `/app/components/book-selector/book-selector.css?${VERSION}`;
        this.model = () => this.getModel();
        this.subjects = [];
        this.salesforceTitles = [];
        this.booksBySubject = (subject) =>
            this.salesforceTitles
                .filter((b) => b.subject === subject)
                .sort()
                .reduce((a, b) => b.value === a.value ? a : a.concat(b), [])
        ;
        this.bookIsSelected = {};
    }

    getModel() {
        this.props = this.getProps();

        return {
            prompt: this.props.prompt,
            subjects: this.subjects,
            booksBySubject: this.booksBySubject
        };
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.subjects = Array.from(new Set(this.salesforceTitles.map((book) => book.subject))).sort();
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

}

import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './testimonial-form.html';
import css from './testimonial-form.css';
import shell from '~/components/shell/shell';
import userModel, {accountsModel} from '~/models/usermodel';
import booksPromise from '~/models/books';
import FormSelect from '~/components/form-select/form-select';
import salesforce from '~/models/salesforce';

const spec = {
    template,
    css,
    view: {
        classes: ['testimonial-form']
    },
    regions: {
        selector: '.book-selector'
    },
    model() {
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            book: this.book,
            submitTo: `${salesforce.salesforceHome}/servlet/servlet.WebToLead?encoding=UTF-8`
        };
    }
};

export default class TestimonialForm extends componentType(spec) {

    onLoaded() {
        accountsModel.load().then((info) => {
            this.id = info.id;
            this.name = info.full_name;
            this.role = info.self_reported_role;
            this.book = null;
            this.update();
        });
        booksPromise.then((items) => {
            const options = items.map((i) => ({
                label: i.title,
                value: i.salesforce_abbreviation
            }));

            this.regions.selector.attach(new FormSelect({
                instructions: 'Book title',
                validationMessage: () => '',
                placeholder: 'Please select one',
                name: 'book_title',
                options
            }, (newValue) => {
                this.book = newValue;
                this.update();
            }));
        });
    }

    show() {
        shell.showDialog(() => ({
            title: 'Enter your testimonial',
            content: this
        }));
    }

}

import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './testimonial-form.html';
import css from './testimonial-form.css';
import booksPromise from '~/models/books';
import FormSelect from '~/components/form-select/form-select';
import salesforce from '~/models/salesforce';
import {on} from '~/helpers/controller/decorators';

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
            role: this.role,
            book: this.book,
            email: this.email,
            school: this.school,
            firstName: this.firstName,
            lastName: this.lastName,
            salesforce,
            submitTo: salesforce.webtoleadUrl
        };
    }
};

function hideDialog() {
    this.emit('close-form');
}

export default class TestimonialForm extends componentType(spec, busMixin) {

    onLoaded() {
        booksPromise.then((items) => {
            const options = items.map((i) => ({
                label: i.title,
                value: i.salesforce_abbreviation
            }));

            this.regions.selector.attach(new FormSelect({
                instructions: 'Book title',
                validationMessage: () => '',
                placeholder: 'Please select one',
                name: '00NU00000053nzR',
                options
            }, (newValue) => {
                this.book = newValue;
                this.update();
            }));
        });
    }

    @on('submit form')
    watchForResponse() {
        if (!this.listeningForResponse) {
            this.listeningForResponse = true;
            this.el.querySelector('#form-response').addEventListener('load', hideDialog);
        }
    }

    onClose() {
        this.el.querySelector('#form-response').removeEventListener('load', hideDialog);
    }

}

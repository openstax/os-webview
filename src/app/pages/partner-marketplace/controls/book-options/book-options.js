import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './book-options.html';
import css from './book-options.css';
import booksPromise, {salesforceTitles, subjects} from '~/models/books';
import {books as store} from '../../filter-store';
import Checkboxes from '../checkboxes-linked-to-store/checkboxes-linked-to-store';

const spec = {
    template,
    css,
    view: {
        classes: ['book-options']
    },
    model() {
        return {
            subjects: this.subjects
        };
    },
    subjects: []
};

export default class extends componentType(spec) {

    init(...args) {
        super.init(...args);
        booksPromise.then((books) => {
            this.salesforceTitles = salesforceTitles(books);
            this.subjects = subjects(this.salesforceTitles);
        });
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        booksPromise.then(() => {
            this.update();
            this.subjects.forEach((subject) => {
                const options = this.salesforceTitles
                    .filter((b) => b.subjects.includes(subject))
                    .map((info) => ({
                        label: info.text,
                        value: info.value
                    }));
                const region = this.regionFrom(`[data-subject="${subject}"]`);
                const cb = new Checkboxes({
                    el: region.el,
                    store,
                    options
                });
            });
        });
    }

}

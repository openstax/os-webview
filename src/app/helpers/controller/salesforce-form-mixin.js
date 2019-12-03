import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import mix from '~/helpers/controller/mixins';
import {salesforceTitles} from '~/models/books';

export function salesforceFormFunctions(superclass) {
    return class extends superclass {

        @on('change')
        updateOnChange() {
            this.update();
        }

        @on('click [type="submit"]')
        doCustomValidation(event) {
            const invalid = Array.from(this.el.querySelectorAll('form :invalid'))
                .find((el) => {
                    const r = el.getBoundingClientRect();

                    return r.top !== r.bottom;
                });

            this.hasBeenSubmitted = true;
            if (invalid) {
                $.scrollTo(invalid.parentNode);
                event.preventDefault();
                this.update();
            }
            this.submitClicked = true;
            return invalid;
        }

        beforeSubmit() {
            return true;
        }

        @on('submit form')
        changeSubmitMode(e) {
            // Running through beforeSubmit was somehow causing me to receive
            // a second submit event. This stops that.
            if (! this.submitClicked) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return;
            }
            this.submitClicked = false;
            if (this.beforeSubmit()) {
                this.submitted = true;
                this.update();
            } else {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }

    };
}

export default (superclass) => class extends mix(superclass).with(salesforceFormFunctions) {

    init(...args) {
        if (super.init) {
            super.init(...args);
        }
        this.slug = 'books';
    }

    onDataLoaded() {
        this.salesforceTitles = salesforceTitles(this.pageData.books);
    }

};

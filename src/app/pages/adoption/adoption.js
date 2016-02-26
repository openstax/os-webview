import BaseView from '~/helpers/backbone/view';
import BookInfoView from './book-info/book-info';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './adoption.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    templateHelpers: {
        urlOrigin: window.location.origin,
        strips
    },
    regions: {
        primaryBook: '#primary-book',
        secondaryBook: '#secondary-book'
    }
})
export default class AdoptionForm extends BaseView {

    @on('click .toggle-section')
    toggleSection() {
        event.preventDefault();
        this.toggler.toggle();
    }

    @on('submit form')
    failIfInvalid(event) {
        let invalid = this.el.querySelectorAll('.invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    onRender() {
        this.el.classList.add('adoption-form');
        let bookInfoView = new BookInfoView('adoption');

        this.regions.primaryBook.append(bookInfoView);
    }

}

import BaseView from '~/helpers/backbone/view';
import BookInfoView from './book-info/book-info';
import {props} from '~/helpers/backbone/decorators';
import {template} from './adoption-form.hbs';

@props({
    template: template,
    regions: {
        primaryBook: '#primary-book',
        secondaryBook: '#secondary-book'
    }
})
export default class AdoptionForm extends BaseView {
    onRender() {
        this.el.classList.add('text-content');
        let bookInfoView = new BookInfoView('adoption'),
            toggleControl = this.el.querySelector('.toggle-section'),
            toggleArea = document.getElementById('secondary-book'),
            toggleIsOpen = false,
            openText = '+ Add a second book',
            closeText = '- Remove the second book',
            form = this.el.querySelector('form'),
            updateToggleRegion = () => {
                let region = this.regions.secondaryBook;

                if (toggleIsOpen) {
                    let secondaryBookView = new BookInfoView('adoption_two');

                    toggleControl.innerHTML = closeText;
                    region.append(secondaryBookView);
                    toggleArea.style.display = '';
                } else {
                    toggleControl.innerHTML = openText;
                    region.empty();
                    toggleArea.style.display = 'none';
                }
            };

        this.regions.primaryBook.append(bookInfoView);
        updateToggleRegion();

        toggleControl.addEventListener('click', (event) => {
            event.preventDefault();
            toggleIsOpen = !toggleIsOpen;
            updateToggleRegion();
        });

        form.addEventListener('submit', (event) => {
            let invalid = this.el.querySelectorAll('.invalid');

            if (invalid.length > 0) {
                event.preventDefault();
            }
        });
    }

}

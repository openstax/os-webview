import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './category-section.hbs';
import Book from './book/book';

@props({
    template: template,
    regions: {
        books: '.book-category .row'
    }
})
export default class CategorySection extends BaseView {

    constructor(category, books, model) {
        super();

        this.category = category;
        this.books = books;
        this.model = model;
        this.templateHelpers = {
            categoryName: category
        };

        this.model.on('change:selectedFilter', () => this.setState());
    }

    setState() {
        let value = this.model.get('selectedFilter');

        this.el.classList.toggle('hidden', value !== this.category && value !== 'View All');
    }

    onRender() {
        this.el.classList.add('book-category');

        for (let book of this.books) {
            this.regions.books.append(new Book(book, this.model));
        }

        this.setState();
    }

}

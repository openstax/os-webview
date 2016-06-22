import {Controller} from 'superb';
import {description as template} from './category-section.html';
import Book from './book/book';

export default class CategorySection extends Controller {

    init(category, books, model) {
        this.template = template;
        this.regions = {
            books: '.book-category .row'
        };
        this.view = {
            classes: ['book-category']
        };
        // FIX: Should category, books, and model all be part of the model?
        this.category = category;
        this.books = books;
        this.model = model;
        this.templateHelpers = {
            categoryName: category
        };

        // FIX: listenTo vs on
        this.model.on('change:selectedFilter', () => this.setState());
    }

    setState() {
        if (!this.el) {
            return;
        }

        const value = this.model.get('selectedFilter');

        // FIX: Move DOM manipulation to template
        this.el.classList.toggle('hidden', value !== this.category && value !== 'View All');
    }

    onLoaded() {
        if (this.books) {
            for (const book of this.books) {
                this.regions.books.append(new Book(book, this.model));
            }
        }

        this.setState();
    }

}

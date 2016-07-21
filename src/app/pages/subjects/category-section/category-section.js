import {Controller} from 'superb';
import Book from './book/book';
import {description as template} from './category-section.html';

export default class CategorySection extends Controller {

    init(category, books) {
        this.template = template;
        this.view = {
            classes: ['book-category']
        };
        this.category = category;
        this.books = books;
        this.regions = {
            books: '.row'
        };
    }

    onLoaded() {
        if (this.books) {
            for (const book of this.books) {
                this.regions.books.append(new Book(book));
            }
            this.el.querySelector('.subject').innerHTML = this.books.label;
        }
    }

}

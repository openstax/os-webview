import {Controller} from 'superb';
import Book from './book/book';
import $ from '~/helpers/$';
import {render as template} from './category-section.html';

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
        }
        $.insertHtml(this.el, this.books || {});
    }

    filter(category) {
        this.el.classList.toggle('hidden', category !== 'view-all' && category !== this.category);
    }

}

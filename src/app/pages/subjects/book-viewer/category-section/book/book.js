import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './book.html';

export default class Book extends Controller {

    init(bookInfo) {
        this.template = template;
        this.model = {
            coverUrl: bookInfo.cover_url,
            slug: bookInfo.slug,
            detailsOpenClass: '',
            title: bookInfo.title,
            detailsLinkText: $.isPolish(bookInfo.slug) ?
                'szczegóły i zasoby' : 'details & resources'
        };
        this.view = {
            classes: ['cover']
        };
        this.bookInfo = bookInfo;
    }

    onLoaded() {
        if (this.bookInfo.book_state === 'coming_soon') {
            this.el.classList.add('coming-soon');
        }
        if ($.isPolish(this.bookInfo.slug)) {
            this.el.classList.add('polish');
        }
    }

}

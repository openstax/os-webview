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
            detailsLinkText: bookInfo.slug.substr(-6) === 'polska' ?
                'szczegóły i zasoby' : 'details & resources'
        };
        this.view = {
            classes: ['cover']
        };
        this.bookInfo = bookInfo;
    }

    onLoaded() {
        if (this.bookInfo.coming_soon) {
            this.el.classList.add('coming-soon');
        }
        if (this.bookInfo.slug.substr(-6) === 'polska') {
            this.el.classList.add('polish');
        }
    }

}

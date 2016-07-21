import {Controller} from 'superb';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import {description as template} from './book.html';

export default class Book extends Controller {

    init(bookInfo) {
        this.template = template;
        this.model = {
            coverUrl: bookInfo.cover_url,
            slug: bookInfo.slug
        };
        this.view = {
            classes: ['cover']
        };
        this.regions = {
            getThis: '.get-this-title-container'
        };
        this.bookInfo = bookInfo;
    }

    onLoaded() {
        this.regions.getThis.append(new GetThisTitle(this.bookInfo));
        if (this.bookInfo.webview_link === '') {
            this.el.classList.add('coming-soon');
        }
    }

}

import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import {description as template} from './book.html';

export default class Book extends Controller {

    init(bookInfo) {
        this.template = template;
        this.model = {
            coverUrl: bookInfo.cover_url,
            slug: bookInfo.slug,
            detailsOpenClass: '',
            title: bookInfo.title,
            detailsLinkText: bookInfo.slug === 'books/fizyka-dla-szkół-wyższych-polska' ?
                'szczegóły i zasoby' : 'details & resources'
        };
        this.view = {
            classes: ['cover']
        };
        this.regions = {
            getThis: '.get-this-title-container'
        };
        this.bookInfo = bookInfo;
        this.getThis = new GetThisTitle(this.bookInfo);
    }

    onLoaded() {
        this.regions.getThis.append(this.getThis);
        if (this.bookInfo.coming_soon) {
            this.el.classList.add('coming-soon');
        }
    }

    hideChildren() {
        this.getThis.model.submenu = 'hidden';
        this.getThis.update();
        this.model.detailsOpenClass = '';
        this.update();
    }

    openMenu() {
        this.model.detailsOpenClass = this.model.detailsOpenClass === 'open' ? '' : 'open';
        this.update();
        this.getThis.model.submenu = '';
        this.getThis.update();
        $.scrollTo(this.el);
    }

    @on('click img')
    selectOrDetails(event) {
        if ($.isTouchDevice()) {
            this.openMenu();
        } else {
            // Clicking the book cover is the same as clicking the CTA button
            this.el.querySelector('.cta>.btn').click(event);
        }
    }

    @on('keydown img')
    operateByKey(event) {
        if ([$.key.space, $.key.enter].includes(event.keyCode)) {
            event.preventDefault();
            this.openMenu();
        }
    }

    @on('keydown')
    escClosesSubmenu(event) {
        if (event.keyCode === $.key.esc) {
            this.hideChildren();
        }
    }

}

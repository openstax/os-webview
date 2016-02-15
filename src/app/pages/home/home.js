import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './home.hbs';
import Quotes from './quotes/quotes';
import Education from './education/education';
import Buckets from './buckets/buckets';

const books = [
    'astronomy',
    'biology',
    'chemistry',
    'us-history'
];

@props({
    template: template,
    regions: {
        bookBanner: '.book-banner',
        quotes: '.quote-buckets',
        education: '.education',
        buckets: '.buckets'
    }
})
export default class Home extends BaseView {

    onRender() {
        this.updateHeaderStyle();
        window.addEventListener('scroll', this.updateHeaderStyle.bind(this));

        // Lazy-load a random book
        this.showBookBanner(books[Math.floor(Math.random()*books.length)]);

        this.regions.quotes.show(new Quotes());
        this.regions.education.show(new Education());
        this.regions.buckets.show(new Buckets());
    }

    showBookBanner(book) {
        let view = this;

        System.import(`~/pages/home/banners/${book}/${book}`).then((m) => {
            let Page = m.default;

            view.regions.bookBanner.show(new Page());
            view.currentBookBanner = book;
        });
    }

    updateHeaderStyle() {
        if (!appView.header || !this.el) {
            return;
        }

        if (window.pageYOffset >= 250 ) {

            appView.header.pin().visible();

        } else if (window.pageYOffset <= 249 && window.pageYOffset >= 150) {

            appView.header.reset().pin();

        } else {

            appView.header.reset();

        }
    }

    onBeforeClose() {
        window.removeEventListener('scroll', this.updateHeaderStyle.bind(this));

        if (appView.header) {
            appView.header.reset();
        }
    }

}

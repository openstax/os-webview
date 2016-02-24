import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './home.hbs';
import Quotes from '~/components/quotes/quotes';
import Buckets from '~/components/buckets/buckets';
import Education from './education/education';

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

        let metaNavHeight = appView.header.metaNavHeight;
        let height = appView.header.height;

        if (window.pageYOffset > metaNavHeight && !appView.header.isPinned()) {
            appView.header.reset().collapse().pin();
            this.el.style.paddingTop = `${height / 10}rem`;
        } else if (window.pageYOffset <= metaNavHeight && !appView.header.isTransparent()) {
            appView.header.reset().transparent();
            this.el.style.paddingTop = '0';
        }
    }

    onBeforeClose() {
        window.removeEventListener('scroll', this.updateHeaderStyle.bind(this));

        if (appView.header) {
            appView.header.reset();
        }
    }

}

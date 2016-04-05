import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './home.hbs';
import Quotes from '~/components/quotes/quotes';
import Buckets from '~/components/buckets/buckets';
import Education from './education/education';

const books = [
    // 'astronomy',
    // 'biology',
    // 'chemistry',
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
        appView.header.updateHeaderStyle();

        // Lazy-load a random book
        this.showBookBanner(books[Math.floor(Math.random()*books.length)]);

        this.regions.quotes.show(new Quotes([
            {
                orientation: 'right',
                hasImage: true,
                quoteHtml: 'We’re recruiting for our Fall 2016 pilot of Concept Coach!',
                linkUrl: 'http://cc.openstax.org',
                linkText: 'Learn More'
            },
            {
                orientation: 'full',
                hasImage: false,
                quoteHtml: `“OpenStax is AMAZING. Access to these high quality textbooks
                is GAME CHANGING for our students.”
                <span>&mdash; <cite>Prof. Wendy Riggs, College of the Redwoods</cite></span>`
            }
        ]));
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

}

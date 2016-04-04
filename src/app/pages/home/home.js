import LoadingView from '~/helpers/backbone/loading-view';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './home.hbs';
import Quotes from '~/components/quotes/quotes';
import Buckets from '~/components/buckets/buckets';
import Education from './education/education';

const books = [
    // 'astronomy',
    'biology',
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
export default class Home extends LoadingView {
    @on('click a[href^="#"]')
    hashClick(e) {
        $.scrollTo($.hashTarget(e));
        e.preventDefault();
    }

    parallaxBanner() {
        let bookBanner = this.el.querySelector('.book-banner > div > div');

        bookBanner.setAttribute('style', `background-position-y: -${window.pageYOffset/2}px`);
    }

    onRender() {
        super.onRender();
        appView.header.updateHeaderStyle();
        window.addEventListener('scroll', this.parallaxBanner.bind(this));

        // Lazy-load a random book
        this.showBookBanner(books[Math.floor(Math.random()*books.length)]);

        this.regions.quotes.show(new Quotes([
            {
                orientation: 'right',
                hasImage: true,
                quoteHtml: `Concept Coach is our free new tool that helps college
                students understand and retain what they’ve read. We’re recruiting
                faculty for our Fall 2016 pilot!`,
                linkUrl: 'http://cc.openstax.org',
                linkText: 'Learn More'
            },
            {
                orientation: 'full',
                hasImage: false,
                quoteHtml: `<p>“OpenStax is <em>amazing</em>. Access to these high quality textbooks
                is game changing for our students.”</p>
                <div class="attribution">&mdash; <cite>Prof. Wendy Riggs, College of the Redwoods</cite></div>`
            }
        ]));
        this.regions.education.show(new Education());
        this.regions.buckets.show(new Buckets());
    }

    onLoaded() {
        super.onLoaded();
        this.el.querySelector('.home-page').classList.remove('hidden');
    }

    showBookBanner(book) {
        let view = this;

        System.import(`~/pages/home/banners/${book}/${book}`).then((m) => {
            let Page = m.default;

            view.regions.bookBanner.show(new Page({parent: view}));
            view.currentBookBanner = book;
        });
    }

    showNextBookBanner() {
        this.showBookBanner(books[Math.floor(Math.random()*books.length)]);
    }

}

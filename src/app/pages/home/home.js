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
export default class Home extends LoadingView {
    @on('click a[href^="#"]')
    hashClick(e) {
        let target = e.target;

        while (!target.href) {
            target = target.parentNode;
        }
        let hash = new URL(target.href).hash,
            targetEl = document.getElementById(hash.substr(1));

        $.scrollTo(targetEl);
        e.preventDefault();
    }

    onRender() {
        appView.header.updateHeaderStyle();

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
        setTimeout(() => {
            this.el.querySelector('.loader').style.display = 'none';
            this.el.querySelector('.home-page').style.display = 'block';
        }, 3000);
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

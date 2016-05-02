import LoadingView from '~/helpers/backbone/loading-view';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './home.hbs';
import Quotes from '~/components/quotes/quotes';
import Buckets from '~/components/buckets/buckets';
import Education from './education/education';
import './home.css!';

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const banners = shuffle([
    // 'astronomy',
    'biology',
    // 'chemistry',
    'us-history'
]);

@props({
    template: template,
    regions: {
        bookBanners: '.book-banners',
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
        let bookBanners = this.el.querySelectorAll('.book-banners > div > div');
        let books = this.el.querySelectorAll('.book');

        for (let bookBanner of bookBanners) {
            bookBanner.setAttribute('style', `background-position: 20% -${window.pageYOffset/2}px`);
        }

        for (let book of books) {
            book.setAttribute('style', `margin-top: ${window.pageYOffset/20}px`);
        }
    }

    onRender() {
        super.onRender();
        appView.header.updateHeaderStyle();
        this.attachListenerTo(window, 'scroll', () =>
            window.requestAnimationFrame(this.parallaxBanner.bind(this))
        );

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

        for (let banner of banners) {
            let view = this;

            this.bannerViews = [];

            System.import(`~/pages/home/banners/${banner}/${banner}`).then((m) => {
                let Page = m.default;
                let display = false;

                if (view.currentBanner !== 0) {
                    view.currentBanner = 0;
                    display = true;
                }

                let bannerView = new Page({
                    parent: view,
                    name: banner,
                    display: display
                });

                this.bannerViews.push(bannerView);
                view.regions.bookBanners.append(bannerView);
            });
        }
    }

    onLoaded() {
        super.onLoaded();
        this.el.querySelector('.home-page').classList.remove('hidden');
    }

    showBanner(banner) {
        this.bannerViews[banner].show();
    }

    showNextBanner() {
        this.bannerViews[this.currentBanner].hide();

        let next = ++this.currentBanner;

        if (next >= banners.length) {
            next = 0;
            this.currentBanner = 0;
        }

        this.showBanner(next);
    }

}

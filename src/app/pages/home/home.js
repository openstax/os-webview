import LoadingView from '~/controllers/loading-view';
import $ from '~/helpers/$';
import {utils} from 'superb';
import {on} from '~/helpers/controller/decorators';
import shell from '~/components/shell/shell';
import Quotes from '~/components/quotes/quotes';
import Buckets from '~/components/buckets/buckets';
import Education from './education/education';
import {description as template} from './home.html';
import Banner from './banners/banner';

function shuffle(array) {
    let currentIndex = array.length;

    while (0 !== currentIndex) {
        const randomIndex = Math.floor(Math.random() * currentIndex);

        currentIndex -= 1;

        const temporaryValue = array[currentIndex];

        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const bannerModels = shuffle([
    // Will not be released until Nov 2016
    {
        subject: 'astronomy',
        subjectTitle: 'astronomy',
        quote: 'see beyond this world',
        features: ['chart', 'equation'],
        buttonSpec1: 'btn-gold',
        buttonSpec2: 'btn-cyan',
        alignedEdge: 'right'
    },
    {
        subject: 'biology',
        subjectTitle: 'Biology',
        quote: 'live the wild life',
        features: ['diagram', 'leaf'],
        buttonSpec1: 'btn-gold',
        buttonSpec2: 'btn-turquoise',
        alignedEdge: 'left'
    },
    {
        subject: 'chemistry',
        subjectTitle: 'Chemistry',
        quote: 'transform',
        features: ['element'],
        buttonSpec1: 'btn-gold',
        buttonSpec2: 'btn-turquoise',
        alignedEdge: 'right'
    },
    {
        subject: 'us-history',
        subjectTitle: 'U.S. History',
        quote: 'see into the past',
        features: ['clermont', 'sacajawea', 'john-adams'],
        buttonSpec1: 'btn-yellow',
        buttonSpec2: 'btn-turquoise',
        alignedEdge: 'right'
    }
]);


export default class Home extends LoadingView {

    static description = `OpenStax's goal is to increase student access to
        high-quality learning materials at little to no cost. Learn more
        about what we offer for college and K-12.`;

    init() {
        this.template = template;
        this.css = '/app/pages/home/home.css';
        this.regions = {
            banners: '.book-banners',
            quotes: '.quote-buckets',
            education: '.education',
            buckets: '.buckets'
        };
        this.view = {
            classes: ['home-page']
        };
        this.banners = bannerModels.map((model) => new Banner(model));
        this.currentBanner = 0;
    }

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e, {doHistory: false});
    }

    static metaDescription = () => `OpenStax's goal is to increase student access to
        high-quality learning materials, at little to no cost. Learn more about what we
        offer for college and K-12.`;

    parallaxBanner() {
        const bookBanners = this.el.querySelectorAll('.book-banners > div > div');
        const books = this.el.querySelectorAll('.book');
        const educationBanner = this.el.querySelector('.education-banner');
        const educationBannerStudent = this.el.querySelector('.education-banner .student');


        educationBanner.setAttribute('style', `background-position: 50% ${window.pageYOffset/30}px`);
        educationBannerStudent.setAttribute('style', `bottom: -${window.pageYOffset/40}px`);


        for (const bookBanner of bookBanners) {
            bookBanner.setAttribute('style', `background-position: 20% -${window.pageYOffset/2}px`);
        }

        for (const book of books) {
            book.setAttribute('style', `margin-top: ${window.pageYOffset/20}px`);
        }
    }

    setupDebouncedParallax() {
        const pageYOffset = window.pageYOffset - 1;
        const bannerEl = this.el.querySelector('.book-banners');
        const backgrounds = bannerEl.querySelectorAll('.background-image');
        const setBackgroundHeights = (height, top) => {
            for (const bgEl of backgrounds) {
                bgEl.style.height = `${height}px`;
            }
        };

        this.debouncedParallax = utils.debounce(() => {
            const bannerRect = bannerEl.getClientRects();
            const bannerBottom = bannerRect[0].bottom;
            const height = bannerBottom > 0 ? bannerBottom : 0;

            setBackgroundHeights(height);
        }, 10, false);
    }

    onLoaded() {
        shell.header.updateHeaderStyle();
        for (const view of this.banners) {
            this.regions.banners.append(view);
        }
        this.banners[this.currentBanner].show();
        this.setupDebouncedParallax();
        window.addEventListener('scroll', this.debouncedParallax);
        window.addEventListener('resize', this.debouncedParallax);

        this.modelInterval = setInterval(() => {
            this.banners[this.currentBanner].hide()
            .then(() => {
                ++this.currentBanner;
                this.currentBanner %= this.banners.length;
                this.banners[this.currentBanner].show();
            });
        }, 11000);

        const quotesView = new Quotes([
            {
                orientation: 'left',
                hasImage: true,
                image: '/images/home/quotes/quote-right.jpg',
                quoteHtml: `Concept Coach is our free new tool that helps college
                students understand and retain what they've read. We're recruiting
                faculty for our Fall 2016 pilot!`,
                link: 'http://cc.openstax.org',
                cta: 'Learn More'
            },
            {
                orientation: 'full',
                hasImage: false,
                quoteHtml: `<p>“OpenStax is <em>amazing</em>. Access to these high quality textbooks
                is game changing for our students.”</p>
                <div class="attribution">&mdash; <cite>Prof. Wendy Riggs, College of the Redwoods</cite></div>`
            },
            {
                orientation: 'full',
                colorScheme: 'cyan',
                hasImage: false,
                overlay: '/images/home/quotes/book-mass-renewal-bucket.svg',
                quoteHtml: 'Using OpenStax in your course again this semester?',
                link: '/mass-renewal',
                cta: 'Let Us Know'
            }
        ]);

        this.regions.quotes.attach(quotesView);
        this.regions.education.attach(new Education());
        this.regions.buckets.attach(new Buckets());
    }

    onClose() {
        clearInterval(this.modelInterval);
        clearInterval(this.parallaxInterval);
        window.removeEventListener('scroll', this.debouncedParallax);
        window.removeEventListener('resize', this.debouncedParallax);
    }

}

import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {utils} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import shell from '~/components/shell/shell';
import Quotes from '~/components/quotes/quotes';
import Buckets from '~/components/buckets/buckets';
import Education from './education/education';
import {description as template} from './home.html';
import {shuffle} from '~/helpers/data';
import Banner from './banners/banner';

const bannerModels = shuffle([{
    subject: 'astronomy',
    subjectURL: '/details/books/astronomy',
    subjectTitle: 'Astronomy',
    quote: 'see beyond this world',
    features: ['chart', 'equation'],
    buttonSpec1: 'btn-gold',
    buttonSpec2: 'btn-cyan',
    alignedEdge: 'right'
}, {
    subject: 'biology',
    subjectURL: '/details/books/biology',
    subjectTitle: 'Biology',
    quote: 'live the wild life',
    features: ['diagram', 'leaf'],
    buttonSpec1: 'btn-gold',
    buttonSpec2: 'btn-turquoise',
    alignedEdge: 'left'
}, {
    subject: 'chemistry',
    subjectURL: '/details/books/chemistry',
    subjectTitle: 'Chemistry',
    quote: 'transform',
    features: ['element'],
    buttonSpec1: 'btn-gold',
    buttonSpec2: 'btn-turquoise',
    alignedEdge: 'right'
}, {
    subject: 'us-history',
    subjectURL: '/details/books/us-history',
    subjectTitle: 'U.S. History',
    quote: 'see into the past',
    features: ['clermont', 'sacajawea', 'john-adams'],
    buttonSpec1: 'btn-yellow',
    buttonSpec2: 'btn-turquoise',
    alignedEdge: 'right'
}, {
    subject: 'math',
    subjectURL: '/subjects/math',
    subjectTitle: 'Math',
    quote: 'solve for the unknown',
    features: [],
    buttonSpec1: 'btn-orange',
    buttonSpec2: 'btn-turquoise',
    alignedEdge: 'right'
}]);


export default class Home extends CMSPageController {

    static description = 'OpenStax\'s goal is to increase student access ' +
        'to high-quality learning materials at little to no cost. See what ' +
        'we have to offer for college and AP courses.';

    init() {
        this.slug = 'pages/openstax-homepage';
        this.template = template;
        this.css = `/app/pages/home/home.css?${VERSION}`;
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
        this.model = {
            loaded: ''
        };

        shell.showLoader();
    }

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e, {doHistory: false});
    }

    onLoaded() {
        document.title = 'Home - OpenStax';
        shell.header.updateHeaderStyle();
    }

    pos(range, relY, offset) {
        return this.limit(0, 1, relY - offset) * range;
    }

    limit(min, max, value) {
        return Math.max(min, Math.min(max, value));
    }

    onDataLoaded() {
        let ticking = false;

        this.parallaxBannerUpdate = (bookBanner) => {
            const relativeY = window.pageYOffset / 3000;
            const backgroundImage = bookBanner.querySelector('.background-image');
            const bookCover = bookBanner.querySelector('.container .book');
            const student = bookBanner.querySelector('.container .student');

            backgroundImage.setAttribute('style',
                `transform:translate3d(0, ${this.pos(-200, relativeY, 0)}px, 0)`);
            bookCover.setAttribute('style', `transform:translate3d(0, ${this.pos(-100, relativeY, 0)}px, 0)`);
            student.setAttribute('style', `transform:translate3d(0, ${this.pos(200, relativeY, 0)}px, 0)`);
        };

        for (const view of this.banners) {
            this.regions.banners.append(view);
        }
        this.banners[this.currentBanner].show();
        this.parallaxBannerUpdate(this.banners[this.currentBanner].el);

        this.parallaxBanner = () => {
            const bookBanner = this.el.querySelector('.book-banners > .banner.fadein');

            this.parallaxBannerUpdate(bookBanner);
            ticking = false;
        };

        this.parallaxOnScroll = (evt) => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(this.parallaxBanner);
            }
        };

        window.addEventListener('scroll', this.parallaxOnScroll, false);

        this.modelInterval = setInterval(() => {
            if (!document.hidden) {
                this.banners[this.currentBanner].hide()
                    .then(() => {
                        ++this.currentBanner;
                        this.currentBanner %= this.banners.length;
                        this.parallaxBannerUpdate(this.banners[this.currentBanner].el);
                        this.banners[this.currentBanner].show();
                    });
            }
        }, 11000);

        const quotesData = this.pageData.row_1.map((columnData) => {
            const result = Object.assign({}, columnData);
            const imageData = columnData.image;

            result.hasImage = !!imageData.image;
            return result;
        });
        const quotesView = new Quotes(quotesData);

        this.regions.quotes.attach(quotesView);

        const educationData = this.pageData.row_2;

        this.regions.education.attach(new Education(educationData));

        const bucketData = [4, 5].map((rowNum, index) => {
            const cmsData = this.pageData[`row_${rowNum}`][0];
            const result = Object.assign({}, cmsData);

            // FIX: color schemes should be configured in the CMS
            result.bucketClass = index ? 'partners' : 'our-impact';
            result.btnClass = index ? 'btn-gold' : 'btn-cyan';
            result.hasImage = !!result.image.image;

            return result;
        });

        this.regions.buckets.attach(new Buckets(bucketData));
        this.model.loaded = 'loaded';
        this.update();

        shell.hideLoader();
    }

    onClose() {
        clearInterval(this.modelInterval);
        window.removeEventListener('scroll', this.parallaxOnScroll);
        shell.header.updateHeaderStyle();
    }

}

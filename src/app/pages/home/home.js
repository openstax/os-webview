import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {utils} from 'superb';
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
    subjectTitle: 'astronomy',
    quote: 'see beyond this world',
    features: ['chart', 'equation'],
    buttonSpec1: 'btn-gold',
    buttonSpec2: 'btn-cyan',
    alignedEdge: 'right'
}, {
    subject: 'biology',
    subjectTitle: 'Biology',
    quote: 'live the wild life',
    features: ['diagram', 'leaf'],
    buttonSpec1: 'btn-gold',
    buttonSpec2: 'btn-turquoise',
    alignedEdge: 'left'
}, {
    subject: 'chemistry',
    subjectTitle: 'Chemistry',
    quote: 'transform',
    features: ['element'],
    buttonSpec1: 'btn-gold',
    buttonSpec2: 'btn-turquoise',
    alignedEdge: 'right'
}, {
    subject: 'us-history',
    subjectTitle: 'U.S. History',
    quote: 'see into the past',
    features: ['clermont', 'sacajawea', 'john-adams'],
    buttonSpec1: 'btn-yellow',
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
        this.model = {
            loaded: ''
        };

        // Safari private window patch
        try {
            localStorage.visitedGive = Number(localStorage.visitedGive || 0) + 1;
        } catch (e) {}
    }

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e, {doHistory: false});
    }

    onLoaded() {
        document.title = 'Home - OpenStax';
        shell.header.updateHeaderStyle();

        this.parallaxBanner = () => {
            const bookBanners = this.el.querySelectorAll('.book-banners > .banner');

            for (const bookBanner of bookBanners) {
                const bookBannersBackgroundImage = bookBanner.querySelector('.background-image');
                const bookBannersBook = bookBanner.querySelector('.container .book');
                const bookBannersStudent = bookBanner.querySelector('.container .student');

                bookBannersBackgroundImage.setAttribute('style',
                                                        `transform:translate3d(0,-${window.pageYOffset/15}px,0)`);
                bookBannersBook.setAttribute('style', `transform:translate3d(0,-${window.pageYOffset/8}px,0)`);
                bookBannersStudent.setAttribute('style', `transform:translate3d(0,${window.pageYOffset/10}px,0)`);
            }
        };

        this.parallaxOnScroll = () => {
            window.requestAnimationFrame(() => {
                this.parallaxBanner();
            });
        };

        this.parallaxBanner();
        window.addEventListener('scroll', this.parallaxOnScroll);
    }

    onDataLoaded() {
        for (const view of this.banners) {
            this.regions.banners.append(view);
        }
        this.banners[this.currentBanner].show();

        this.modelInterval = setInterval(() => {
            this.banners[this.currentBanner].hide()
            .then(() => {
                ++this.currentBanner;
                this.currentBanner %= this.banners.length;
                this.banners[this.currentBanner].show();
            });
        }, 11000);

        const quotesData = this.pageData.row_1.map((columnData) => {
            const result = Object.assign({}, columnData);
            const imageData = columnData.image;

            result.hasImage = !!imageData.image;
            return result;
        });
        const quotesView = new Quotes(quotesData);

        this.regions.quotes.attach(quotesView);

        const educationData = this.pageData.row_2.map((columnData) => Object.assign({}, columnData));

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
    }

    onClose() {
        clearInterval(this.modelInterval);
        window.removeEventListener('scroll', this.parallaxOnScroll);
    }

}

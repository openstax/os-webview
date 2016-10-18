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
        localStorage.visitedGive = Number(localStorage.visitedGive || 0) + 1;
    }

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e, {doHistory: false});
    }

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
        const bannerEl = this.el.querySelector('.book-banners');
        const containerEl = bannerEl.querySelector('.container');
        const backgrounds = bannerEl.querySelectorAll('.background-image');
        const squaresAndFeatures = Array.from(bannerEl.querySelectorAll('.feature,[class^="square-"]'))
        .map((el) => ({el}));

        const setBackgroundHeights = (height) => {
            for (const bgEl of backgrounds) {
                bgEl.style.height = `${height}px`;
            }
        };

        const moveFeatures = (bannerRect, containerRect) => {
            const containerMidX = containerRect.width / 2.5;
            const containerMidY = containerRect.height / 2;
            const offset = bannerRect.height - bannerRect.bottom;

            for (const elInfo of squaresAndFeatures) {
                if (!('left' in elInfo)) {
                    const style = window.getComputedStyle(elInfo.el);

                    elInfo.left = +style.left.replace('px', '');
                    elInfo.top = +style.top.replace('px', '');
                    const midX = elInfo.left + style.width.replace('px', '') / 2;
                    const midY = elInfo.top + style.height.replace('px', '') / 2;

                    elInfo.xDir = midX < containerMidX ? -1 : 1;
                    elInfo.yDir = midY < containerMidY ? -1 : 1;
                }

                elInfo.el.style.left = `${elInfo.left + offset * elInfo.xDir}px`;
                elInfo.el.style.top = `${elInfo.top + offset * elInfo.yDir}px`;
            }
            squaresAndFeatures.modified = true;
        };

        const resetFeatures = () => {
            for (const elInfo of squaresAndFeatures) {
                elInfo.el.style.left = '';
                elInfo.el.style.top = '';
            }
            squaresAndFeatures.modified = false;
        };

        this.debouncedParallax = utils.debounce(() => {
            const bannerRect = bannerEl.getClientRects()[0];
            const containerRect = bannerEl.getClientRects()[0];
            const bannerBottom = bannerRect.bottom;
            const height = bannerBottom > 0 ? bannerBottom : 0;

            setBackgroundHeights(height);
            if (bannerBottom < bannerRect.height) {
                moveFeatures(bannerRect, containerRect);
            } else if (squaresAndFeatures.modified) {
                resetFeatures();
            }
        }, 10);
    }

    onLoaded() {
        document.title = 'Home - OpenStax';
        shell.header.updateHeaderStyle();
        for (const view of this.banners) {
            this.regions.banners.append(view);
        }
        this.banners[this.currentBanner].show();
        try {
            this.setupDebouncedParallax();
        } catch (e) {
            console.warn(e);
        }
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
    }

    onDataLoaded() {
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
        this.debouncedParallax();
    }

    onClose() {
        clearInterval(this.modelInterval);
        clearInterval(this.parallaxInterval);
        window.removeEventListener('scroll', this.debouncedParallax);
        window.removeEventListener('resize', this.debouncedParallax);
    }

}

import $ from '~/helpers/$';
import BannerCarousel from './banner-carousel/banner-carousel';
import Buckets from '~/components/buckets/buckets';
import CMSPageController from '~/controllers/cms';
import Education from './education/education';
import Quotes from '~/components/quotes/quotes';
import shell from '~/components/shell/shell';
import VERSION from '~/version';
import {description as template} from './home.html';
import {on} from '~/helpers/controller/decorators';
import {shuffle} from '~/helpers/data';
import {utils} from 'superb.js';

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
        const bannerCarousel = new BannerCarousel(() => this.pageData.banner_images);

        this.regions.banners.attach(bannerCarousel);

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

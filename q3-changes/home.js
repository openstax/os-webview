import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import BannerCarousel from './banner-carousel/banner-carousel';
import Buckets from './buckets/buckets';
import Education from './education/education';
import Quotes from './quotes/quotes.jsx';
import css from './home.css';

const spec = {
    css,
    view: {
        classes: ['home-page'],
        tag: 'main',
        id: 'maincontent'
    },
    slug: 'pages/openstax-homepage'
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class Home extends BaseClass {

    onDataLoaded() {
        const bannerCarousel = new BannerCarousel(() => ({
            largeImages: this.pageData.banner_images,
            smallImages: this.pageData.mobile_banner_images
        }));
        const quotesData = this.pageData.row_1.map((columnData) => {
            const result = Object.assign(
                {
                    hasImage: !!columnData.image.image
                },
                columnData
            );

            return result;
        });
        const quotesView = new Quotes(quotesData);
        const educationData = this.pageData.row_2;
        const bucketData = [4, 5].map((rowNum, index) => {
            const cmsData = this.pageData[`row_${rowNum}`][0];
            const result = Object.assign({
                bucketClass: index ? 'partners' : 'our-impact',
                hasImage: index === 0
            }, cmsData);

            return result;
        });

        this.regions.self.attach(bannerCarousel);
        this.regions.self.append(quotesView);
        this.regions.self.append(new Education(educationData));
        this.regions.self.append(new Buckets(bucketData));
    }

}

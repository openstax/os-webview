import {Controller} from 'superb';
// FIX: Why is this using Bucket instead of Buckets?
import Bucket from '~/components/buckets/bucket/bucket';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import Hero from './hero/hero';
import Tutor from './tutor/tutor';
import {description as template} from './k-12.html';

export default class K12 extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/k-12/k-12.css';
        this.view = {
            classes: ['k-12-page', 'page']
        };
        // FIX: Can these regions be absorbed into the view?
        this.regions = {
            hero: '.hero',
            buckets: '.buckets-section',
            tutor: '.tutor-banner > div',
            products: '.products'
        };

        this.description = `K-12 classrooms benefit from our adaptive learning
            courseware and open content, including textbooks for AP® courses.
            Find out how your class can take part.`;
    }

    onLoaded() {
        this.regions.hero.attach(new Hero());
        this.regions.tutor.append(new Tutor());
        this.regions.buckets.attach(new Bucket({
            orientation: 'full',
            bucketClass: 'partners',
            hasImage: false,
            titleText: 'OpenStax Partners',
            blurbHtml: `OpenStax partners have united with us to increase access to
                high-quality learning materials. Their low-cost tools integrate seamlessly
                with our books for AP<sup>&reg;</sup> courses.`,
            btnClass: 'btn-yellow',
            linkUrl: '/partners/ap',
            linkText: 'View Partners'
        }));
        this.regions.products.attach(new ProductsBoxes({
            products: ['ap', 'Tutor']
        }));
    }

}

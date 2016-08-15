import {Controller} from 'superb';
import Buckets from '~/components/buckets/buckets';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import {description as template} from './ap.html';

export default class AP extends Controller {

    static description = 'Classrooms benefit from our adaptive learning ' +
        'courseware and open content, including textbooks for AP® courses. ' +
        'Find out how your class can take part.';

    init() {
        document.querySelector('head meta[name="description"]').content = AP.description;
        this.template = template;
        this.css = '/app/pages/ap/ap.css';
        this.view = {
            classes: ['ap-page', 'page']
        };
        this.regions = {
            buckets: 'insert-region[data-name="buckets"]',
            products: 'insert-region[data-name="products"]'
        };
    }

    onLoaded() {
        this.regions.buckets.attach(new Buckets([{
            image: {
                alignment: 'full'
            },
            bucketClass: 'partners',
            hasImage: false,
            heading: 'OpenStax Partners',
            content: `OpenStax partners have united with us to increase access to
                high-quality learning materials. Their low-cost tools integrate seamlessly
                with our books for AP<sup>&reg;</sup> courses.`,
            btnClass: 'btn-yellow',
            link: '/partners/ap',
            cta: 'View Partners'
        }]));
        this.regions.products.attach(new ProductsBoxes({
            products: ['ap']
        }));
    }

}

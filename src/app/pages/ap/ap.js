import {Controller} from 'superb';
import Buckets from '~/components/buckets/buckets';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import {description as template} from './ap.html';

export default class AP extends Controller {

    static description = 'Explore OpenStax textbooks for Advanced Placement ' +
        'courses, available free online and low-cost in print and ready to ' +
        'adopt for high school classrooms.';

    init() {
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
        document.title = 'AP® - OpenStax';

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

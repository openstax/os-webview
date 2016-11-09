import CMSPageController from '~/controllers/cms';
import Buckets from '~/components/buckets/buckets';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import {description as template} from './ap.html';

export default class AP extends CMSPageController {

    static description = 'Explore OpenStax textbooks for Advanced Placement ' +
        'courses, available free online and low-cost in print and ready to ' +
        'adopt for high school classrooms.';

    init() {
        this.template = template;
        this.css = '/app/pages/ap/ap.css';
        this.view = {
            classes: ['ap-page', 'page', 'hide-until-loaded']
        };
        this.regions = {
            buckets: 'insert-region[data-name="buckets"]',
            products: 'insert-region[data-name="products"]'
        };
        this.slug = 'pages/ap';
        this.model = {};
    }

    onLoaded() {
        document.title = 'AP® - OpenStax';
    }

    onDataLoaded() {
        this.model = Object.assign({}, this.pageData);
        this.update();
        this.regions.products.attach(new ProductsBoxes(this.pageData.row_1));
        const bucketData = this.pageData.row_2.map((d) => Object.assign({
            bucketClass: 'partners',
            btnClass: 'btn-yellow'
        }, d));

        this.regions.buckets.attach(new Buckets(bucketData));
        this.el.classList.add('loaded');
    }

}

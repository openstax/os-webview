import settings from 'settings';
import CMSPageController from '~/controllers/cms';
import {description as template} from './higher-ed.html';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import Quotes from '~/components/quotes/quotes';
import Buckets from '~/components/buckets/buckets';

const loginQuery = `${settings.apiOrigin}/accounts/login/openstax/?next=`;
const nextLink = `${settings.apiOrigin}/faculty-verification`;
const loginLink = `${loginQuery}${nextLink}`;

export default class HigherEd extends CMSPageController {

    static description = 'Our open, peer-reviewed college textbooks are free ' +
        'online and come with resources from us and our partners. See how you can ' +
        'adopt our books for your course.';

    init() {
        this.slug = 'higher-education';
        this.template = template;
        this.css = '/app/pages/higher-ed/higher-ed.css';
        this.view = {
            classes: ['higher-ed-page', 'page']
        };
        this.regions = {
            quotes: '.quote-buckets',
            products: '.products',
            buckets: '.buckets'
        };
        this.model = {
            'intro_heading': '',
            loginLink
        };
        document.querySelector('head meta[name="description"]').content = HigherEd.description;
    }

    onLoaded() {
        document.title = 'Higher-ed - OpenStax';
        this.regions.products.attach(new ProductsBoxes({
            products: ['books', 'Concept Coach', 'OpenStax CNX']
        }));
    }

    onDataLoaded() {
        this.model = Object.assign(this.model, this.pageData);
        this.model.row_3[0].bucketClass = 'our-impact';
        this.model.row_3[1].bucketClass = 'partners';
        this.model.row_3[0].btnClass = 'btn-cyan';
        this.model.row_3[1].btnClass = 'btn-gold';

        this.update();

        this.regions.quotes.attach(new Quotes(this.model.row_1));
        this.regions.buckets.attach(new Buckets(this.model.row_3));
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        this.el.querySelector('.hero .overlay .blurb').innerHTML = this.model.intro_description;
    }

}

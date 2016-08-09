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
            products: [
                'books',
                'Concept Coach',
                'OpenStax CNX'
            ]
        }));
    }

    onDataLoaded() {
        this.model = Object.assign(this.model, this.pageData);
        this.update();

        const quoteData = this.model.row_1[0].value.map((columnData) => {
            const valueData = columnData.value;
            const result = Object.assign({}, valueData);

            if (valueData.image.image) {
                result.image = valueData.image.image;
                result.orientation = valueData.image.alignment;
            } else {
                delete result.image;
            }

            return result;
        });

        this.regions.quotes.attach(new Quotes(quoteData));

        const bucketData = this.model.row_3[0].value.map((columnData, index) => {
            const value = columnData.value;
            const result = {
                orientation: value.image.image ? value.image.alignment : 'full',
                bucketClass: index ? 'partners' : 'our-impact',
                hasImage: value.image.image !== null,
                titleText: value.heading,
                blurbHtml: value.content,
                btnClass: index ? 'btn-gold' : 'btn-cyan',
                linkUrl: value.link,
                linkText: value.cta
            };

            return result;
        });

        this.regions.buckets.attach(new Buckets(bucketData));

        this.regions.products.attach(new ProductsBoxes({
            products: ['books', 'Concept Coach', 'OpenStax CNX']
        }));
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        this.el.querySelector('.hero .overlay .blurb').innerHTML = this.model.intro_description;
    }

}

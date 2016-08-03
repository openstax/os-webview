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

    static description = `Our open, peer-reviewed college textbooks are free
online and come with resources from us and our partners. See how you can
adopt our books for your course.`;

    init() {
        this.id = 88;
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

        this.regions.quotes.attach(new Quotes([{
            content: this.model.row_0_box_1_content,
            image: this.model.row_0_box_1_image_url,
            orientation: this.get_row_0_box_1_image_alignment_display,
            cta: this.model.row_0_box_1_cta,
            link: this.model.row_0_box_1_link
        }, {
            content: this.model.row_0_box_2_content,
            image: this.model.row_0_box_2_image_url,
            orientation: this.model.get_row_0_box_2_image_alignment_display,
            cta: this.model.row_0_box_2_cta,
            link: this.model.row_0_box_2_link
        }]));

        this.regions.buckets.attach(new Buckets([{
            cta: this.model.row_2_box_1_cta,
            description: this.model.row_2_box_1_description,
            heading: this.model.row_2_box_1_heading,
            link: this.model.row_2_box_1_link
        }, {
            cta: this.model.row_2_box_2_cta,
            description: this.model.row_2_box_2_description,
            heading: this.model.row_2_box_2_heading,
            link: this.model.row_2_box_2_link
        }]));

        this.regions.products.attach(new ProductsBoxes({
            products: ['books', 'Concept Coach', 'OpenStax CNX']
        }));
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        this.el.querySelector('.hero .overlay .blurb').innerHTML = this.model.intro_description;
    }

}

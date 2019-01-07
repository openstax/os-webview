import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './bookstore-suppliers.html';
import css from './bookstore-suppliers.css';

const spec = {
    template,
    css,
    view: {
        classes: ['bookstore-suppliers', 'page'],
        tag: 'main'
    },
    slug: 'pages/print-order',
    model: {}
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class BookstoreSuppliers extends BaseClass {

    onDataLoaded() {
        const providerToModel = (p) => ({
            name: p.name,
            description: p.blurb || '',
            logoUrl: p.icon,
            buttonUrl: p.url,
            buttonText: p.cta
        });
        const suppliers = this.pageData.providers.map(providerToModel);
        const featuredSuppliers = this.pageData.featured_providers.map(providerToModel);

        this.model = {
            headline: this.pageData.title,
            subhead: this.pageData.intro_heading,
            subhead2: this.pageData.intro_description,
            featuredSuppliersBlurb: this.pageData.featured_provider_intro_blurb,
            featuredSuppliers,
            featuredCardsClass: (featuredSuppliers.length % 3) ? 'by-twos' : '',
            suppliersBlurb: this.pageData.other_providers_intro_blurb,
            suppliers,
            cardsClass: (suppliers.length % 3) ? 'by-twos' : '',
            buttonUrl: this.pageData.isbn_download_url,
            buttonText: this.pageData.isbn_cta
        };
        this.update();
    }

    onUpdate() {
        this.insertHtml();
    }

}

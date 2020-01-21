import componentType, {canonicalLinkMixin, insertHtmlMixin} from '~/helpers/controller/init-mixin';
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
    model() {
        if (!this.pageData) {
            return {};
        }
        const providerToModel = (p) => ({
            name: p.name,
            description: p.blurb || '',
            logoUrl: p.icon,
            buttonUrl: p.url,
            buttonText: p.cta
        });
        const suppliers = this.pageData.providers.map(providerToModel);
        const featuredSupplier = this.pageData.featured_providers.map(providerToModel); // should only be 1

        return {
            headline: this.pageData.title,
            subhead: this.pageData.intro_heading,
            subhead2: this.pageData.intro_description,
            featuredSupplier,
            featuredSuppliersBlurb: this.pageData.featured_provider_intro_blurb,
            suppliersBlurb: this.pageData.other_providers_intro_blurb,
            suppliers,
            usButtonUrl: this.pageData.us_isbn_download_url,
            usButtonText: this.pageData.us_isbn_cta,
            caButtonUrl: this.pageData.canadian_isbn_download_url,
            caButtonText: this.pageData.canadian_isbn_cta
        };
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin, insertHtmlMixin);

export default class BookstoreSuppliers extends BaseClass {

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.update();
    }

}

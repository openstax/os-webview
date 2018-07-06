import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {description as template} from './bookstore-suppliers.html';

export default class BookstoreSuppliers extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['bookstore-suppliers', 'page']
        };
        this.css = `/app/pages/bookstore-suppliers/bookstore-suppliers.css?${VERSION}`;
        this.slug = 'pages/print-order';
        this.model = {};
    }

    onDataLoaded() {
        const providerToModel = (p) => ({
            name: p.name,
            description: p.blurb,
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
        $.insertHtml(this.el, this.model);
    }

}

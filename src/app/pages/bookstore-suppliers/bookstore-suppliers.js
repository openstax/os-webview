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
        const suppliers = [
            {
                name: this.pageData.featured_provider_name,
                description: this.pageData.featured_provider_blurb,
                logoUrl: this.pageData.featured_provider_logo_url,
                buttonUrl: this.pageData.featured_provider_link,
                buttonText: this.pageData.featured_provider_cta
            }
        ];

        this.pageData.providers.forEach((p) => {
            suppliers.push({
                name: p.name,
                description: p.blurb,
                logoUrl: p.icon,
                buttonUrl: p.url,
                buttonText: p.cta
            });
        });
        this.model = {
            headline: this.pageData.title,
            subhead: this.pageData.intro_heading,
            subhead2: this.pageData.intro_description,
            suppliers,
            cardsClass: (suppliers.length % 2) ? 'by-twos' : '',
            buttonUrl: this.pageData.isbn_download_url,
            buttonText: this.pageData.isbn_cta
        };
        this.update();
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}

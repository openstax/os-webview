import BaseView from '~/helpers/backbone/view';
import settings from 'settings';
import {props} from '~/helpers/backbone/decorators';
import {template} from './higher-ed.hbs';
import Quotes from '~/components/quotes/quotes';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import Buckets from '~/components/buckets/buckets';

@props({
    template: template,
    regions: {
        quotes: '.quote-buckets',
        products: '.products',
        buckets: '.buckets'
    }
})
export default class HigherEd extends BaseView {

    onRender() {
        this.regions.quotes.show(new Quotes([
            {
                orientation: 'right',
                hasImage: true,
                quoteHtml: 'We’re recruiting for our Fall 2016 pilot of Concept Coach!',
                linkUrl: 'http://cc.openstax.org',
                linkText: 'Learn More'
            },
            {
                orientation: 'left',
                hasImage: true,
                quoteHtml: 'OpenStax is supported by major philanthropic foundations',
                linkUrl: '/foundation',
                linkText: 'Learn More'
            }
        ]));
        this.regions.products.show(new ProductsBoxes());
        this.regions.buckets.show(new Buckets());
        let anchor = this.el.querySelector('.login-link');
        let loginLink = `${settings.apiOrigin}/accounts/login/openstax/?next=`;
        let nextLink = `${settings.apiOrigin}/faculty-verification`;
        let href = `${loginLink}${nextLink}`;

        anchor.href = href;
    }

}

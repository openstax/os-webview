import BaseView from '~/helpers/backbone/view';
import settings from 'settings';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
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
    @on('click a[href^="#"]')
    hashClick(e) {
        let target = e.target;

        while (!target.href) {
            target = target.parentNode;
        }
        let hash = new URL(target.href).hash,
            targetEl = document.getElementById(hash.substr(1));

        $.scrollTo(targetEl);
        e.preventDefault();
    }

    onRender() {
        this.regions.quotes.show(new Quotes([{
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
        }]));
        this.regions.products.show(new ProductsBoxes({
            products: [
                'Our Books',
                'Concept Coach',
                'OpenStax CNX'
            ]
        }));
        this.regions.buckets.show(new Buckets());

        let anchor = this.el.querySelector('.login-link');
        let loginLink = `${settings.apiOrigin}/accounts/login/openstax/?next=`;
        let nextLink = `${settings.apiOrigin}/faculty-verification`;
        let href = `${loginLink}${nextLink}`;

        anchor.href = href;
    }

}

import BaseView from '~/helpers/backbone/view';
import settings from 'settings';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './higher-ed.hbs';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import Buckets from '~/components/buckets/buckets';

@props({
    template: template,
    css: '/app/pages/higher-ed/higher-ed.css',
    templateHelpers: () => {
        let loginLink = `${settings.apiOrigin}/accounts/login/openstax/?next=`;
        let nextLink = `${settings.apiOrigin}/faculty-verification`;

        return {
            loginLink: `${loginLink}${nextLink}`
        };
    },
    regions: {
        products: '.products',
        buckets: '.buckets'
    }
})
export default class HigherEd extends BaseView {

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e, {doHistory: false});
    }

    onRender() {
        this.regions.products.show(new ProductsBoxes({
            products: [
                'books',
                'Concept Coach',
                'OpenStax CNX'
            ]
        }));

        this.regions.buckets.show(new Buckets());
    }

}

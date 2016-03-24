import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './higher-ed.hbs';
import Quotes from '~/components/quotes/quotes';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import Buckets from '~/components/buckets/buckets';

@props({
    template: template,
    regions: {
        quotes: '.quotes',
        products: '.products',
        buckets: '.buckets'
    }
})
export default class HigherEd extends BaseView {

    onRender() {
        this.regions.quotes.show(new Quotes());
        this.regions.products.show(new ProductsBoxes());
        this.regions.buckets.show(new Buckets());
    }

}

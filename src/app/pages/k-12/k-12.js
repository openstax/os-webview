import BaseView from '~/helpers/backbone/view';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './k-12.hbs';
import Bucket from '~/components/bucket/bucket';
import Hero from './hero/hero';
import Tutor from './tutor/tutor';
import {template as strips} from '~/components/strips/strips.hbs';
import ProductsBoxes from '~/components/products-boxes/products-boxes';
import './k-12.css!';

@props({
    template: template,
    regions: {
        hero: '.hero',
        buckets: '.buckets-section',
        tutor: '.tutor-banner',
        products: '.products'
    },
    templateHelpers: {strips}
})
export default class K12 extends BaseView {
    @on('click a[href^="#"]')
    hashClick(e) {
        $.scrollTo($.hashTarget(e));
        e.preventDefault();
    }

    onRender() {
        appView.header.updateHeaderStyle();

        this.regions.buckets.append(new Bucket({
            orientation: 'full',
            bucketClass: 'allies',
            hasImage: false,
            titleText: 'OpenStax Allies',
            blurbHtml: `OpenStax Allies have united with us to increase access to
            high-quality learning materials. Their low-cost tools integrate seamlessly
            with our books for AP<sup>&reg;</sup> courses.`,
            btnClass: 'btn-yellow',
            linkUrl: '/allies/ap',
            linkText: 'View Allies'
        }));

        this.regions.hero.show(new Hero());
        this.regions.tutor.show(new Tutor());
        this.regions.products.show(new ProductsBoxes({
            products: [
                'ap',
                'Tutor'
            ]
        }));
    }
}

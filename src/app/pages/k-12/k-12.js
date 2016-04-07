import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './k-12.hbs';
import Bucket from '~/components/bucket/bucket';
import Banner from './banner/banner';
import Tutor from './tutor/tutor';
import {template as strips} from '~/components/strips/strips.hbs';
import ProductsBoxes from '~/components/products-boxes/products-boxes';

@props({
    template: template,
    regions: {
        banner: '.banner',
        buckets: '.buckets-section',
        tutor: '.tutor-banner',
        products: '.products'
    },
    templateHelpers: {strips}
})
export default class K12 extends BaseView {

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

        this.regions.banner.show(new Banner());
        this.regions.tutor.show(new Tutor());
        this.regions.products.show(new ProductsBoxes({
            products: [
                'ap',
                'Tutor'
            ]
        }));
    }
}

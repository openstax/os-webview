import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './k-12.hbs';
import Bucket from '~/components/bucket/bucket';
import Quotes from '~/components/quotes/quotes';
import Banner from './banner/banner';
import Tutor from './tutor/tutor';
import {template as strips} from '~/components/strips/strips.hbs';
import ProductsBoxes from '~/components/products-boxes/products-boxes';

@props({
    template: template,
    regions: {
        banner: '.banner',
        quotes: '.quote-buckets',
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
            blurbHtml: `OpenStax allies provide additional tools alongside our
                OpenStax texts, because we believe that education is a community
                effort.`,
            btnClass: 'btn-yellow',
            linkUrl: '/allies',
            linkText: 'View Allies'
        }));

        this.regions.quotes.show(new Quotes());
        this.regions.banner.show(new Banner());
        this.regions.tutor.show(new Tutor());
        this.regions.products.show(new ProductsBoxes({subject: 'ap'}));
    }
}

import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './buckets.hbs';
import Bucket from '../bucket/bucket';

const bucketClasses = ['our-impact', 'partners'];
const buttonClasses = ['btn-cyan', 'btn-gold'];

@props({
    template: template,
    css: '/app/components/buckets/buckets.css',
    regions: {
        buckets: '.buckets-section'
    }
})
export default class Buckets extends BaseView {
    constructor(data) {
        super();
        if (data) {
            this.data = data.map((item, index) => ({
                orientation: 'left',
                bucketClass: bucketClasses[index],
                hasImage: false,
                titleText: item.heading,
                blurbHtml: item.description,
                btnClass: buttonClasses[index],
                linkUrl: item.link,
                linkText: item.cta
            }));
        } else {
            this.data = [
                {
                    orientation: 'left',
                    bucketClass: 'our-impact',
                    hasImage: true,
                    titleText: 'Our Impact',
                    blurbHtml: `Prof. Wolchonok has saved students $15,000
                    and opened doors for them to pursue health science careers
                    by adopting our free Anatomy and Physiology book. `,
                    btnClass: 'btn-cyan',
                    linkUrl: '/impact',
                    linkText: 'See Our Impact'
                },
                {
                    orientation: 'full',
                    bucketClass: 'partners',
                    hasImage: false,
                    titleText: 'OpenStax Partners',
                    blurbHtml: `OpenStax partners have united with us to increase access
                    to high-quality learning materials. Their low-cost tools integrate
                    seamlessly with OpenStax books.`,
                    btnClass: 'btn-gold',
                    linkUrl: '/partners',
                    linkText: 'View Partners'
                }
            ];
        }
    }


    onRender() {
        for (let bucketData of this.data) {
            this.regions.buckets.append(new Bucket(bucketData));
        }
    }
}

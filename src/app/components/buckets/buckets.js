import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './buckets.hbs';
import Bucket from '../bucket/bucket';

@props({
    template: template,
    regions: {
        buckets: '.buckets-section'
    }
})
export default class Buckets extends BaseView {
    onRender() {
        // this.regions.buckets.append(new Bucket({
        //     orientation: 'right',
        //     bucketClass: 'give',
        //     hasImage: true,
        //     titleText: 'Give',
        //     blurbHtml: `Joshua is working to support himself while going
        //     to college on the GI Bill. Your donations helped create the
        //     free textbook he is using to complete his college degree.`,
        //     btnClass: 'btn-yellow',
        //     linkUrl: '/give',
        //     linkText: 'Give Today'
        // }));
        this.regions.buckets.append(new Bucket({
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
        }));
        this.regions.buckets.append(new Bucket({
            orientation: 'full',
            bucketClass: 'allies',
            hasImage: false,
            titleText: 'OpenStax Allies',
            blurbHtml: `OpenStax allies provide additional tools
            integrated with our OpenStax texts, because we believe
            that education is a community effort.`,
            btnClass: 'btn-yellow',
            linkUrl: '/allies',
            linkText: 'View Allies'
        }));
    }
}

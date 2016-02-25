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
        this.regions.buckets.append(new Bucket({
            orientation: 'right',
            bucketClass: 'give',
            hasImage: true,
            titleText: 'Give',
            blurbHtml: `Tanaya is a single mother and first generation college
            student. Your donations helped create the free Biology textbook
            she is now using on her path to become a nurse.`,
            btnClass: 'btn-yellow',
            linkUrl: '/give',
            linkText: 'Give Today'
        }));
        this.regions.buckets.append(new Bucket({
            orientation: 'left',
            bucketClass: 'our-impact',
            hasImage: true,
            titleText: 'Our Impact',
            blurbHtml: `Prof. Craig has saved students $350,000 and opened the
            doors for over 1000 future engineers and scientists by adopting
            OpenStax Physics.`,
            btnClass: 'btn-cyan',
            linkUrl: '/impact',
            linkText: 'Learn More About Our Impact'
        }));
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
    }
}

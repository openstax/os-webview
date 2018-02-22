import {Controller} from 'superb.js';
import Bucket from './bucket/bucket';
import VERSION from '~/version';
const bucketClasses = ['our-impact', 'partners'];
const buttonClasses = ['btn-cyan', 'btn-gold'];

export default class Buckets extends Controller {

    init(data) {
        this.template = () => '';
        this.css = `/app/components/buckets/buckets.css?${VERSION}`;
        this.view = {
            classes: ['buckets-section']
        };
        this.model = data;
    }

    onLoaded() {
        for (const bucketData of this.model) {
            this.regions.self.append(new Bucket(bucketData));
        }
    }

}

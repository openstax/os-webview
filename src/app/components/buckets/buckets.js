import {Controller} from 'superb.js';
import Bucket from './bucket/bucket';
import VERSION from '~/version';
const bucketClasses = ['our-impact', 'partners'];
const buttonClasses = ['btn-cyan', 'btn-gold'];

export default class Buckets extends Controller {

    init(props) {
        this.template = () => '';
        this.css = `/app/components/buckets/buckets.css?${VERSION}`;
        this.view = {
            classes: ['buckets-section']
        };
        this.props = props;
    }

    onLoaded() {
        for (const bucketData of this.props) {
            this.regions.self.append(new Bucket(bucketData));
        }
    }

}

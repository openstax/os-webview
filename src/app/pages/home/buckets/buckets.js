import {Controller} from 'superb.js';
import Bucket from './bucket/bucket';
import css from './buckets.css';

const bucketClasses = ['our-impact', 'partners'];
const buttonClasses = ['btn-cyan', 'btn-gold'];

export default class Buckets extends Controller {

    init(props) {
        this.template = () => '';
        this.css = css;
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

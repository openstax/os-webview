import componentType from '~/helpers/controller/init-mixin';
import Bucket from './bucket/bucket';
import css from './buckets.css';

const spec = {
    css,
    view: {
        classes: ['buckets-section']
    }
};

export default class Buckets extends componentType(spec) {

    init(props) {
        super.init();
        this.props = props;
    }

    onLoaded() {
        this.props.forEach((bucketData) => {
            this.regions.self.append(new Bucket(bucketData));
        });
    }

}

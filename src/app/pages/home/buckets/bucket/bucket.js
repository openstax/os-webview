import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './bucket.html';

const spec = {
    template
};

export default class extends componentType(spec, insertHtmlMixin) {

    init(props) {
        super.init();
        this.view = {
            classes: [
                'bucket',
                props.bucketClass,
                props.image.alignment
            ]
        };
        this.model = props;
    }

}

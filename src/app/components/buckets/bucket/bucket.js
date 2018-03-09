import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './bucket.html';

export default class Bucket extends Controller {

    init(props) {
        this.template = template;
        this.view = {
            classes: [
                'bucket',
                props.bucketClass,
                props.image.alignment
            ]
        };
        this.model = props;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

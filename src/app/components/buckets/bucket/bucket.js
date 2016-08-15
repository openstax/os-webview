import {Controller} from 'superb';
import {description as template} from './bucket.html';

export default class Bucket extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: [
                'bucket',
                model.bucketClass,
                model.image.alignment
            ]
        };
        this.model = model;
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        this.el.querySelector('blurb-html').innerHTML = this.model.content;
    }

}

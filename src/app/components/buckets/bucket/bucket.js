import {Controller} from 'superb.js';
import $ from '~/helpers/$';
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

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

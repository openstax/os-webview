import {Controller} from 'superb';
import $ from '~/helpers/$';
import {description as template} from './product-box.html';

export default class ProductBox extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['product-box', model.name]
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }
}

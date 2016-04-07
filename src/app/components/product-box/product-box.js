import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './product-box.hbs';

@props({template})
export default class ProductBox extends BaseView {
    constructor(data) {
        super();
        this.templateHelpers = data;
    }

    onRender() {
        this.el.classList.add('product-box', this.templateHelpers.name);
    }
}

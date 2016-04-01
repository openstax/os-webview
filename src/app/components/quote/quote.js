import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './quote.hbs';

@props({template})
export default class Quote extends BaseView {
    constructor(templateHelpers) {
        super();
        this.templateHelpers = templateHelpers;
    }

    onRender() {
        this.el.classList.add('quote-bucket', this.templateHelpers.orientation);
    }
}

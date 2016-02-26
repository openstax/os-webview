import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './bucket.hbs';

@props({
    template: template
})
export default class Bucket extends BaseView {
    constructor(templateHelpers) {
        super();
        this.templateHelpers = templateHelpers;
    }

    onRender() {
        this.el.classList.add('bucket', this.templateHelpers.bucketClass,
            this.templateHelpers.orientation);
    }
}

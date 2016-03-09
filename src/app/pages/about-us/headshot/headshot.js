import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './headshot.hbs';

@props({template})
export default class Headshot extends BaseView {
    constructor(templateHelpers) {
        super();
        this.templateHelpers = templateHelpers;
    }

    onRender() {
        this.el.classList.add('headshot');
    }
}

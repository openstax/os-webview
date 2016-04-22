import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './remover.hbs';

@props({template})
export default class Remover extends BaseView {
    constructor(callback) {
        super();
        this.callback = callback.bind(this);
    }

    onRender() {
        this.el.classList.add('remover');
        this.attachListenerTo(this.el, 'click', this.callback);
    }
}

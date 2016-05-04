import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './remover.hbs';

@props({
    template: template,
    css: '/app/components/remover/remover.css'
})
export default class Remover extends BaseView {
    @on('click')
    callCallback() {
        this.callback();
    }

    constructor(callback) {
        super();
        this.callback = callback;
    }

    onRender() {
        this.el.classList.add('remover');
    }
}

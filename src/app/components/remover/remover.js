// FIX: Remove this component

import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './remover.html';

export default class Remover extends Controller {

    init(callback) {
        this.template = template;
        this.css = '/app/components/remover/remover.css';
        this.callback = callback;
    }

    @on('click')
    callCallback() {
        this.callback();
    }

    onLoaded() {
        this.el.classList.add('remover');
    }

}

import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './404.hbs';

@props({template})
export default class NotFound extends BaseView {
    onRender() {
        this.el.classList.add('text-content');
    }
}

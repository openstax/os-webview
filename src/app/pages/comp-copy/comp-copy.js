import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './comp-copy.hbs';

@props({
    template: template
})
export default class CompCopyForm extends BaseView {
    onRender() {
        this.el.classList.add('text-content');
    }
}

import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './text-input.hbs';

@props({
    template: template
})

export default class TextInputView extends BaseView {
    constructor(templateHelpers) {
        super();
        this.templateHelpers = templateHelpers;
    }
    onRender() {
        this.el.classList.add('section');
    }
}

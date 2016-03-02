import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './option.hbs';

@props({template})
export default class Option extends BaseView {
    @on('click')
    selectOption() {
        this.model.set('selected', true);
    }
    constructor(model) {
        super();
        this.templateHelpers = {
            label: model.get('label')
        };
        this.model = model;
    }

    onRender() {
        this.el.classList.add('option');
    }
}

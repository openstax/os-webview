import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './select-option.hbs';

@props({template})
export default class Option extends BaseView {
    @on('click')
    selectOption(e) {
        // Recognize re-selection as a change, too
        this.model.attributes.selected = true;
        this.model.trigger('change:selected', this.model);
        e.stopPropagation();
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

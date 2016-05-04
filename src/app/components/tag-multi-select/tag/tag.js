import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './tag.hbs';

@props({
    template: template
})
export default class Tag extends BaseView {
    @on('click .remover')
    deselect() {
        this.model.set('selected', false);
    }

    constructor(model) {
        super();
        this.model = model;
        this.templateHelpers = {
            label: model.get('label')
        };
    }
}

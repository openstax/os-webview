import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './options-list.html';
import css from './options-list.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['options-list'],
        role: 'listbox'
    },
    model() {
        return {
            items: this.items,
            selected: (value) => this.selected.includes(value)
        };
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        this.selected.on('notify', () => this.update());
    }

    @on('click [role="option"]')
    toggleSelected(event) {
        const value = event.delegateTarget.dataset.value;

        if ('toggle' in this.selected) {
            this.selected.toggle(value);
        } else {
            this.selected.value = value;
        }
    }

}

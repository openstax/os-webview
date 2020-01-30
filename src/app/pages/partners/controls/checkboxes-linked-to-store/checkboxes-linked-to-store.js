import componentType, {cleanupMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './checkboxes-linked-to-store.html';
import css from './checkboxes-linked-to-store.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['checkboxes-linked-to-store']
    },
    model() {
        return {
            options: this.options,
            checkedClass: (value) => this.store.includes(value) ? 'checked' : ''
        };
    }
};

export default class extends componentType(spec, cleanupMixin) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.cleanup.push(this.store.on('notify', () => this.update()));
    }

    @on('change [type="checkbox"]')
    emitChange(event) {
        const cb = event.delegateTarget;

        this.store.toggle(cb.value);
    }

}

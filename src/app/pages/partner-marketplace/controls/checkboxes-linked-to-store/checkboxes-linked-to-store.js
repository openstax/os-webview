import componentType from '~/helpers/controller/init-mixin';
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
            isSelected: (value) => this.store.includes(value) ? '' : null
        };
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.cleanup = this.store.on('notify', (newValue) => {
            this.update();
        });
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        this.cleanup();
    }

    @on('change [type="checkbox"]')
    emitChange(event) {
        const cb = event.delegateTarget;

        this.store.toggle(cb.value);
        console.info('Toggling', cb.value, this.store.includes(cb.value));
    }

}

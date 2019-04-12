import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './radio-panel.html';

const spec = {
    template,
    view: {
        classes: ['filter-buttons']
    },
    model() {
        return {
            items: this.items,
            isSelected: (value) => this.selectedValue === value
        };
    }
};

export default class extends componentType(spec, busMixin) {

    init(items) {
        super.init();
        this.items = items;
    }

    updateSelected(value) {
        this.selectedValue = value;
        this.update();
    }

    onUpdate() {
        if (super.onUpdate) {
            super.onUpdate();
        }
        this.insertHtml();
    }

    @on('click')
    toggleActive() {
        this.active = !this.active;
        this.el.classList.toggle('active', this.active);
    }

    @on('click .filter-button')
    setCategory(event) {
        const target = event.delegateTarget;
        const newValue = target.dataset ? target.dataset.value : target.getAttribute('data-value');

        if (newValue !== this.selectedValue) {
            this.active = false;
            this.el.classList.remove('active');
        }

        this.updateSelected(newValue);
        this.emit('change', newValue);
    }

    @on('keydown .filter-button')
    operateByKey(event) {
        if ([' ', 'Enter'].includes(event.key)) {
            event.preventDefault();
            this.setCategory(event);
        }
    }

}

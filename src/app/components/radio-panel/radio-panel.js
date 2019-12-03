import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
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

export class RadioPanel extends componentType(spec, insertHtmlMixin, busMixin) {

    whenPropsUpdated() {
        this.update();
    }

    // This is for when it is in mobile/dropdown mode
    @on('click')
    toggleActive() {
        this.el.classList.toggle('active');
    }

    @on('click .filter-button')
    setCategory(event) {
        const target = event.delegateTarget;
        const newValue = target.dataset ? target.dataset.value : target.getAttribute('data-value');

        this.emit('change', newValue);
        if (newValue !== this.selectedValue) {
            this.el.classList.remove('active');
        }
    }

    @on('keydown .filter-button')
    operateByKey(event) {
        if ([' ', 'Enter'].includes(event.key)) {
            event.preventDefault();
            this.setCategory(event);
        }
    }

}

// For compatibility with those that depend on this old, wrong interface
export default class extends RadioPanel {

    init(items) {
        super.init();
        this.items = items;
        this.on('change', (newValue) => this.updateSelected(newValue));
    }

    updateSelected(value) {
        this.selectedValue = value;
        this.update();
    }

    setCategory(event) {
        super.setCategory(event);
    }

}

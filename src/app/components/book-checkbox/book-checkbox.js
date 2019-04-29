import componentType from '~/helpers/controller/init-mixin';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './book-checkbox.html';
import css from './book-checkbox.css';
import busMixin from '~/helpers/controller/bus-mixin';

const spec = {
    template,
    css,
    view: {
        classes: ['book-checkbox']
    },
    model() {
        const props = this.getProps();

        this.el.classList.toggle('has-image', Boolean(props.imageUrl));

        return {
            id: props.id,
            name: props.name,
            value: props.value,
            imageUrl: props.imageUrl,
            label: props.label,
            checked: this.checked
        };
    }

};

export default class BookCheckbox extends componentType(spec, busMixin) {

    init(getProps) {
        super.init();
        this.getProps = getProps;
        this.checked = false;
    }

    @on('click')
    toggleChecked() {
        this.checked = !this.checked;
        this.el.classList.toggle('checked', this.checked);
        this.update();
        this.emit('change', this.checked);
    }

    @on('keydown .indicator')
    toggleOnSpace(event) {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            this.toggleChecked();
        }
    }

}

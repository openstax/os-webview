import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './book-checkbox.html';

export default class BookCheckbox extends Controller {

    init(getProps, onChange) {
        this.template = template;
        this.getProps = getProps;
        this.onChange = onChange;
        this.view = {
            classes: ['book-checkbox']
        };
        // Check this path
        this.css = `/app/components/book-checkbox/book-checkbox.css?${VERSION}`;
        this.checked = false;
        this.model = () => this.getModel();
    }

    // Returns a dictionary of values to be used in the template
    // Refreshes props, to ensure they're up to date
    getModel() {
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

    @on('click')
    toggleChecked() {
        this.checked = !this.checked;
        this.el.classList.toggle('checked', this.checked);
        this.update();
        if (this.onChange) {
            this.onChange(this.checked);
        }
    }

    @on('keydown .indicator')
    toggleOnSpace(event) {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            this.toggleChecked();
        }
    }

}

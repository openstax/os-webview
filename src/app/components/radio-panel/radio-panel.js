import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {render as template} from './radio-panel.html';

export default class RadioPanel extends Controller {

    init(items, onChange) {
        this.template = template;
        this.view = {
            classes: ['filter-buttons']
        };
        this.model = {
            items,
            isSelected: (value) => this.selectedValue === value
        };
        this.active = false;
        this.onChange = onChange;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

    updateSelected(value) {
        this.selectedValue = value;
        this.update();
    }

    @on('click')
    toggleActive() {
        this.active = !this.active;
        this.el.classList.toggle('active', this.active);
    }

    @on('click .filter-button')
    setCategory(event) {
        const target = event.target;
        const newValue = target.dataset ? target.dataset.value : target.getAttribute('data-value');

        if (newValue !== this.selectedValue) {
            this.active = false;
            this.el.classList.remove('active');
        }
        this.updateSelected(newValue);
        this.onChange(newValue);
    }

    @on('keydown .filter-button')
    operateByKey(event) {
        if ([' ', 'Enter'].includes(event.key)) {
            event.preventDefault();
            this.setCategory(event);
        }
    }

}

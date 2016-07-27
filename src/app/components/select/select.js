import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './select.html';

const CONVERT_OPTIONS = Symbol();
const CLOSE_DROPDOWNS = Symbol();
const CONTROLLERS = Symbol();

export default class Select extends Controller {

    init(config) {
        this.template = template;
        this.css = '/app/components/select/select.css';
        this.setup(config);
        this.view = {
            classes: ['select']
        };

        if (this.select.getAttribute('multiple') !== null) {
            this.view.classes.push('select-multi');
        }

        Select[CONTROLLERS] = Select[CONTROLLERS] || [];
        Select[CONTROLLERS].push(this);
    }

    setup(config) {
        this.select = config.select;

        if (!this.select instanceof HTMLSelectElement) {
            throw new Error('A select component must be given a select element to mirror.');
        }

        this.el = config.placeholder;

        if (!this.el instanceof Element) {
            throw new Error('A select component must be given a placeholder element to inject HTML into.');
        }

        this.options = Select[CONVERT_OPTIONS](this.select.options);

        this.model = {};
        this.model.select = this.select;
        this.model.selected = Select[CONVERT_OPTIONS](this.select.selectedOptions);
        this.model.options = Select[CONVERT_OPTIONS](this.select.options);
    }

    static [CONVERT_OPTIONS](collection) {
        const map = new Map();

        for (const el of Array.from(collection)) {
            map.set(el.value, el.textContent);
        }

        return map;
    }

    @on('click')
    toggleDropdown(e) {
        e.preventDefault();
        e.stopPropagation();

        const open = !this.model.open;

        Select[CLOSE_DROPDOWNS]();

        this.model.open = open;
        this.update();
    }

    closeDropdown() {
        this.model.open = false;
        this.update();
    }

    @on('mouseover')
    preventPageScrolling(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);

        if (el.matches('.options') || this.el.querySelector('.options').contains(el)) {
            document.body.classList.add('no-scroll');
        } else {
            this.allowPageScrolling();
        }
    }

    @on('mouseleave')
    allowPageScrolling() {
        document.body.classList.remove('no-scroll');
    }

    @on('click .option')
    toggleOption(e) {
        const value = e.delegateTarget.getAttribute('data-value');
        const text = e.delegateTarget.textContent;

        if (!this.select.multiple) {
            this.model.selected.clear();
        }

        if (this.model.selected.has(value)) {
            this.model.selected.delete(value);
        } else {
            this.model.selected.set(value, text);
        }

        this.update();
    }

    static [CLOSE_DROPDOWNS]() {
        let i = Select[CONTROLLERS].length;

        while (i--) {
            const controller = Select[CONTROLLERS][i];

            if (document.body.contains(controller.select)) {
                controller.closeDropdown();
            } else {
                Select[CONTROLLERS].splice(i, 1);
            }
        }
    }

}

window.addEventListener('click', () => {
    Select[CLOSE_DROPDOWNS]();
});

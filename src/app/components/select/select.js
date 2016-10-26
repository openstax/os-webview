import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './select.html';

const CONVERT_OPTIONS = Symbol();

export default class Select extends Controller {

    init(config, handler, parent) {
        this.template = template;
        this.css = '/app/components/select/select.css';
        this.setup(config);
        this.handler = handler;
        this.view = {
            classes: ['select', 'with-arrow']
        };

        if (this.select.getAttribute('multiple') !== null) {
            this.view.classes.push('select-multi');
        }

        const onClose = parent.onClose;
        const onAttached = parent.onAttached;

        parent.onClose = () => {
            this.detach();
            onClose();
        };

        parent.onAttached = () => {
            this.updateSelectElement();
            onAttached();
        };

        this.keyHandler = (e) => {
            const k = String.fromCharCode(e.keyCode).toLowerCase();
            const listEl = this.el.querySelector('.options');
            const items = listEl.querySelectorAll('.option');

            // Scroll selection to next element beginning with key
            const listTop = listEl.getBoundingClientRect().top;
            const target = Array.from(items)
            .filter((el) => el.textContent.toLowerCase().substr(0, 1) === k)
            .sort((a, b) => {
                const aDiff = a.getBoundingClientRect().top - listTop;
                const bDiff = b.getBoundingClientRect().top - listTop;
                const sTop = listEl.scrollTop;

                if (aDiff <= 0 && bDiff <= 0 || aDiff > 0 && bDiff > 0) {
                    return aDiff - bDiff;
                }
                return bDiff - aDiff;
            });

            if (e.keyCode === 13) {
                // Pick the topmost element
                const notScrolledPast = Array.from(items)
                .filter((el) => el.getBoundingClientRect().top - listTop >= 0);

                if (notScrolledPast.length) {
                    notScrolledPast[0].click();
                }
                return;
            }

            if (target.length > 0) {
                const itemTop = target.shift().getBoundingClientRect().top;
                const scrollDiff = itemTop - listTop;

                listEl.scrollTop += scrollDiff;
            }
        };
        this.keyHandlerActive = false;
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

        this.model = { open: false };
        this.model.select = this.select;
        this.model.selected = Select[CONVERT_OPTIONS](this.select.querySelectorAll('option[selected]'));
        this.model.options = Select[CONVERT_OPTIONS](this.select.options);
        this.updateSelectElement();
    }

    closeDropdown() {
        this.model.open = false;
        this.update();
    }

    updateSelectElement() {
        for (const option of Array.from(this.select.options)) {
            if (this.model.selected.get(option.value)) {
                option.selected = true;
            } else {
                option.selected = false;
            }
        }

        if (this.model.selected.size === 0) {
            this.select.selectedIndex = -1;
        }

        let event;

        if (typeof window.Event === 'function') {
            event = new Event('change', {bubbles: true});
        } else {
            event = document.createEvent('Event');
            event.initEvent('change', true, true);
        }
        this.select.dispatchEvent(event);
    }

    onUpdate() {
        this.el.classList.toggle('open', this.model.open);
        this.setKeyHandler();
    }

    setKeyHandler() {
        if (this.model.open) {
            if (!this.keyHandlerActive) {
                this.keyHandlerActive = true;
                document.addEventListener('keypress', this.keyHandler);
            }
        } else {
            this.keyHandlerActive = false;
            document.removeEventListener('keypress', this.keyHandler);
        }
    }

    @on('mouseover')
    preventPageScrolling(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const optionsEl = this.el.querySelector('.options');

        if (el === optionsEl || optionsEl.contains(el)) {
            this.handler.stopScrolling(optionsEl);
        } else {
            this.allowPageScrolling();
        }
    }

    @on('mouseleave')
    allowPageScrolling() {
        this.handler.startScrolling();
    }

    @on('click .option')
    toggleOption(e) {
        const value = e.delegateTarget.getAttribute('data-value');
        const text = e.delegateTarget.textContent;

        if (!this.select.multiple) {
            this.model.selected.clear();
        } else {
            e.preventDefault();
            e.stopPropagation();
        }

        if (this.model.selected.has(value)) {
            this.model.selected.delete(value);
        } else {
            this.model.selected.set(value, text);
        }

        this.update();
        this.updateSelectElement();
    }

    @on('click .remover')
    removeOption(e) {
        e.stopPropagation();

        const option = e.delegateTarget.previousSibling.getAttribute('data-value');

        this.model.selected.delete(option);

        this.update();
        this.updateSelectElement();
    }

    @on('click')
    toggleDropdown(e) {
        e.preventDefault();
        e.stopPropagation();

        const open = !this.model.open;

        this.handler.closeDropdowns();

        this.model.open = open;
        this.update();
    }

    static [CONVERT_OPTIONS](collection) {
        const map = new Map();

        for (const el of Array.from(collection)) {
            map.set(el.value, el.textContent);
        }

        return map;
    }

    onClose() {
        delete this.handler;
        delete this.select;
    }

}

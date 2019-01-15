import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './select.html';
import css from './select.css';

const CONVERT_OPTIONS = Symbol();

export default class Select extends Controller {

    init(config, handler, parent) {
        this.template = template;
        this.css = css;
        this.setup(config);
        this.handler = handler;
        this.view = {
            classes: ['select', 'with-arrow']
        };

        if (this.select.getAttribute('multiple') !== null) {
            this.view.classes.push('select-multi');
        }

        const onClose = parent.onClose.bind(parent);
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
            if (e.key.length > 1) {
                this.operateByKey(e);
                return;
            }
            const k = String.fromCharCode(e.keyCode).toLowerCase();
            const options = Array.from(this.select.options).map((o) => o.textContent.toLowerCase());

            if (isNaN(this.activeIndex)) {
                this.activeIndex = -1;
            }

            // Look for a match after the current active item, but if not found
            // see if there's one before
            let foundIndex = options.findIndex((text, i) =>
                this.activeIndex < i && text[0] === k);

            if (foundIndex === -1) {
                foundIndex = options.findIndex((text, i) => text[0] === k);
            }

            if (foundIndex > -1) {
                this.activeIndex = foundIndex;
                this.setActiveItem();
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

        this.model = {
            open: false,
            select: this.select,
            placeholder: this.select.getAttribute('placeholder'),
            selected: Select[CONVERT_OPTIONS](this.select.querySelectorAll('option[selected]'))
        };
        this.updateOptions();
        this.updateSelectElement();
        if (this.select.required) {
            this.model.noneMessage = 'Please select...';
            this.isRequired = true;
        } else {
            this.model.noneMessage = 'None';
        }
    }

    onLoaded() {
        this.el.tabIndex = 0;
    }

    closeDropdown() {
        this.model.open = false;
        this.update();
    }

    updateOptions() {
        this.model.options = this.options = Select[CONVERT_OPTIONS](this.select.options);
        this.model.selected = Select[CONVERT_OPTIONS](this.select.querySelectorAll('option[selected]'));
        this.update();
        if (this.model.selected.size === 0) {
            this.select.options.selectedIndex = -1;
        }
    }

    updateSelectElement() {
        for (const option of Array.from(this.select.options)) {
            const selectedness = this.model.selected.get(option.value);

            option.selected = selectedness || selectedness === '';
        }

        if (this.model.selected.size === 0) {
            this.select.selectedIndex = -1;
        }

        // Avoid doing this before setup
        if (this.model.noneMessage) {
            // Work around IE and Firefox which do not recognize a selection of None
            this.select.required = this.isRequired && this.model.selected.size === 0;
            this.update();
        }
        this.select.dispatchEvent($.newEvent('change'));
    }

    setActiveItem() {
        const option = this.select.options[this.activeIndex];

        this.model.activeItem = option.value;
        this.update();
        this.selectingByMouse = false;
        this.scrollToActiveItem();
    }

    scrollToActiveItem() {
        const listEl = this.el.querySelector('.options');
        const listRect = listEl.getBoundingClientRect();
        const listTop = listRect.top;
        const listBottom = listRect.bottom;
        const items = listEl.querySelectorAll('.option');
        const target = items[this.activeIndex];
        const itemRect = target.getBoundingClientRect();
        const itemTop = itemRect.top;
        const itemBottom = itemRect.bottom;
        const scrollDiff = itemTop - listTop;

        if (itemBottom > listBottom) {
            listEl.scrollTop += itemBottom - listBottom;
        }
        if (itemTop < listTop) {
            listEl.scrollTop += itemTop - listTop;
        }
    }

    onUpdate() {
        this.el.classList.toggle('open', this.model.open);
        this.setKeyHandler();
        const optionsList = this.el.querySelector('.options');
        const focusEl = document.activeElement;

        if (!this.scrolled && optionsList && this.model.open && !$.isInViewport(optionsList)) {
            $.scrollTo(this.el, window.innerHeight * 0.1);
            this.scrolled = true;
        }
        if (!this.model.open) {
            this.scrolled = false;
        }
    }

    setKeyHandler() {
        if (this.model.open) {
            if (!this.keyHandlerActive) {
                this.keyHandlerActive = true;
                // Arrow keys are only triggered by onkeydown!
                // https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript
                document.addEventListener('keydown', this.keyHandler);
            }
        } else {
            this.keyHandlerActive = false;
            document.removeEventListener('keydown', this.keyHandler);
        }
    }

    @on('mouseenter .options')
    preventPageScrolling(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const optionsEl = this.el.querySelector('.options');

        if (el === optionsEl || optionsEl.contains(el)) {
            this.handler.stopScrolling(optionsEl);
        } else {
            this.allowPageScrolling();
        }
    }

    @on('mouseleave .options')
    allowPageScrolling() {
        this.handler.startScrolling();
    }

    @on('click .option')
    toggleOption(e) {
        const selectedItem = this.selectingByMouse ? e.delegateTarget : this.el.querySelector('.option.active');
        const value = selectedItem.getAttribute('data-value');
        const text = selectedItem.textContent;
        const handleRequireNone = () => {
            if ('requireNone' in this.select.dataset) {
                if (value === '') {
                    this.model.selected.clear();
                } else {
                    this.model.selected.delete('');
                }
            }
        };

        if (!this.select.multiple) {
            this.model.selected.clear();
        } else {
            e.preventDefault();
            e.stopPropagation();
        }

        handleRequireNone();

        if (this.model.selected.has(value)) {
            this.model.selected.delete(value);
        } else {
            this.model.selected.set(value, text);
        }


        this.update();
        this.updateSelectElement();
    }

    @on('keypress .option.active')
    selectByEnter(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.toggleOption(event);
        }
    }

    @on('click .remover')
    removeOption(e) {
        e.stopPropagation();

        const option = e.delegateTarget.previousSibling.getAttribute('data-value');

        this.model.selected.delete(option);

        this.update();
        this.updateSelectElement();
    }

    @on('keypress .remover')
    removeByEnter(event) {
        if (event.keyCode === $.key.space) {
            event.preventDefault();
            this.removeOption(event);
        }
    }

    @on('click')
    toggleDropdown(e) {
        e.preventDefault();
        e.stopPropagation();

        const open = !this.model.open;

        this.handler.closeDropdowns();

        this.model.open = open;
        this.clearKeyboardSelection();
        this.update();
    }

    @on('mouseover .option')
    clearKeyboardSelection(event) {
        this.selectingByMouse = true;
    }

    @on('keypress')
    operateByKey(event) {
        /* eslint complexity: 0 */
        if (this.model.open) {
            const options = this.select.options;

            if (isNaN(this.activeIndex)) {
                this.activeIndex = -1;
            }
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                this.activeIndex = Math.min(this.activeIndex + 1, options.length - 1);
                this.setActiveItem();
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                this.activeIndex = Math.max(this.activeIndex - 1, 0);
                this.setActiveItem();
            }
            if (event.key === 'Escape') {
                this.closeDropdown();
            }
            if (event.key === 'Enter') {
                this.toggleOption(event);
                if (!this.select.multiple) {
                    window.requestAnimationFrame(() => this.closeDropdown());
                }
            }
        } else if (['Enter', ' '].includes(event.key)) {
            this.toggleDropdown(event);
        }
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

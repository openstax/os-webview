import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './search-bar.html';
import css from './search-bar.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['search-bar']
    },
    model() {
        return {
            searchString: this.inputValue,
            clearHidden: this.inputValue.length === 0 ? '' : null
        };
    }
};

export default class extends componentType(spec, busMixin) {

    get inputValue() {
        const inputEl = this.el.querySelector('[name="search-input"]');

        return inputEl ? inputEl.value :decodeURIComponent(window.location.search.substr(1));
    }
    set inputValue(newValue) {
        const inputEl = this.el.querySelector('[name="search-input"]');

        inputEl.value = newValue;
        this.update();
    }

    @on('click button')
    doSearch() {
        const searchParam = encodeURIComponent(this.inputValue);

        this.emit('value', searchParam);
    }

    @on('keypress [name="search-input"]')
    handleEnter(event) {
        if (event.key === 'Enter') {
            this.doSearch();
        }
    }

    @on('input [name="search-input"]')
    updateClearHidden() {
        this.update();
    }

    @on('click .clear-search')
    clearSearch() {
        this.inputValue = '';
    }

    @on('keypress .clear-search')
    handleEnterOrSpace(event) {
        if (['Enter', ' '].includes(event.key)) {
            event.preventDefault();
            this.clearSearch();
        }
    }

}

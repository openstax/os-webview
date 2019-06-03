import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './inputs.html';
import css from './inputs.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['search-inputs']
    },
    model() {
        return {
            clearIconHiddenFlag: this.textValue.length > 0 ? null : '',
            minimized: this.minimized,
            minimizedClass: this.minimized ? 'minimized' : '',
            filtersHidden: this.filtersHidden,
            searchToggleIconClass: this.minimized ? 'fa fa-search' : 'fa fa-chevron-left'
        };
    }
};

export default class extends componentType(spec, busMixin) {

    whenPropsUpdated(obj) {
        if ('textValue' in obj) {
            this.syncSearchInputs(this.textValue);
        }
        this.update();
    }

    syncSearchInputs(value) {
        const els = Array.from(this.el.querySelectorAll('.search-input'));

        els.forEach((el) => {
            if (el.value !== value) {
                el.value = value;
            }
        });
    }

    @on('input .search-input')
    handleInput(event) {
        this.emit('search-value', event.delegateTarget.value);
    }

    @on('keypress .search-input')
    handleReturn(event) {
        if (event.key === 'Enter') {
            this.emit('run-search');
        }
    }

    @on('click .search-clear')
    clearSearchInput() {
        this.emit('search-value', '');
        this.emit('run-search');
    }

    @on('click .search-icon')
    toggleMinimize(event) {
        this.emit('toggle-minimized');
        event.delegateTarget.blur();
    }

    @on('click .filter-toggle')
    toggleFilters(event) {
        this.emit('filter-toggle');
    }

    @on('keypress [role="button"]')
    simulateClick(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.delegateTarget.dispatch(new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            }));
        }
    }

}

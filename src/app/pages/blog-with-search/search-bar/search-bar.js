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
    }
};

export default class extends componentType(spec, busMixin) {

    get inputValue() {
        return this.el.querySelector('[name="search-input"]').value;
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

}

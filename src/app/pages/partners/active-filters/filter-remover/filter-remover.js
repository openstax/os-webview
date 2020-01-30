import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './filter-remover.html';
import css from './filter-remover.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['filter-remover']
    },
    model() {
        return {
            label: this.label
        };
    }
};

export default class extends componentType(spec) {

    @on('click button')
    removeThis() {
        this.store.toggle(this.value);
    }

}

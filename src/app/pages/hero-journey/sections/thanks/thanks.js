import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './thanks.html';
import css from './thanks.css';

const spec = {
    template,
    view: {
        classes: ['thanks'],
        tag: 'section'
    },
    css
};

export default class extends componentType(spec) {

    init(model) {
        super.init();
        this.model = model;
    }

}

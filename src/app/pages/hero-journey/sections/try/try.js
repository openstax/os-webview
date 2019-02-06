import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './try.html';
import css from './try.css';

const spec = {
    template,
    view: {
        classes: ['try', 'hidden'],
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

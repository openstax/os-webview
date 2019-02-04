import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './share.html';
import css from './share.css';

const spec = {
    template,
    view: {
        classes: ['share'],
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

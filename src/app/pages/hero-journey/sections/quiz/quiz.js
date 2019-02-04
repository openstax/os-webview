import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './quiz.html';
import css from './quiz.css';

const spec = {
    template,
    view: {
        classes: ['quiz'],
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

import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './books.html';
import css from './books.css';

const spec = {
    template,
    view: {
        classes: ['books', 'hero'],
        tag: 'section'
    },
    css
};

export default class extends componentType(spec) {

    init(model) {
        super.init();
        this.model = model;
    }

    onUpdate() {
        this.insertHtml();
    }

}

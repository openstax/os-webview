import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './partners-tab.html';
import css from './partners-tab.css';

const spec = {
    template,
    css,
    view: {
        classes: ['partners-tab']
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    init(model) {
        super.init();
        this.model = model;
    }

}

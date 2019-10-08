import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './why.html';
import css from './why.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['why']
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    onLoaded() {
        this.el.style.backgroundImage = `url('${this.model.background}')`;
    }

}

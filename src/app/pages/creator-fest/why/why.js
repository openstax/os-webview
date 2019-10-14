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

    onAttached() {
        if (this.model.background) {
            const biStyle = window.getComputedStyle(this.el).backgroundImage;
            const newStyle = `${biStyle},url('${this.model.background}')`;

            this.el.style.backgroundImage = newStyle;
        }
    }

}

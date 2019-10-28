import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './banner.html';
import css from './banner.css';

const spec = {
    template,
    css,
    view: {
        classes: ['banner', 'hero'],
        tag: 'section'
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    onLoaded() {
        const biStyle = window.getComputedStyle(this.el).backgroundImage;
        const newStyle = `${biStyle},url('${this.model.background}')`;

        this.el.style.backgroundImage = newStyle;
    }

}

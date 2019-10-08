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

export default componentType(spec, insertHtmlMixin);

import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './about.html';
import css from './about.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['about', 'near-white']
    }
};

export default componentType(spec, insertHtmlMixin);

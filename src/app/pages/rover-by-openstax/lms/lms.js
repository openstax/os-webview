import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './lms.html';
import css from './lms.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'lms',
        classes: ['near-white']
    }
};

export default componentType(spec, insertHtmlMixin);

import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './promoting.html';
import css from './promoting.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['promoting', 'white']
    }
};

export default componentType(spec, insertHtmlMixin);

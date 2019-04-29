import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './speaking.html';
import css from './speaking.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['speaking', 'white']
    }
};

export default componentType(spec, insertHtmlMixin);

import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './results.html';
import css from './results.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['results', 'near-white']
    }
};

export default componentType(spec, insertHtmlMixin);

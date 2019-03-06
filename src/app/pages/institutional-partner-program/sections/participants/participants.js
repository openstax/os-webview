import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './participants.html';
import css from './participants.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['participants', 'white']
    }
};

export default componentType(spec, insertHtmlMixin);

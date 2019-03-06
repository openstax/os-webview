import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './sign-up.html';
import css from './sign-up.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['sign-up', 'green']
    }
};

export default componentType(spec, insertHtmlMixin);

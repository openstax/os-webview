import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './getting-started.html';
import css from './getting-started.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'getting-started',
        classes: ['orange']
    }
};

export default componentType(spec, insertHtmlMixin);

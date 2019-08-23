import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './meet-rover.html';
import css from './meet-rover.css';

const spec = {
    template,
    css,
    view: {
        id: 'meet-rover',
        tag: 'section'
    }
};

export default componentType(spec, insertHtmlMixin);

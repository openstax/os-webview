import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './partners.html';
import css from './partners.css';

const spec = {
    template,
    css,
    view: {
        classes: ['partners']
    }
};

export default componentType(spec, insertHtmlMixin);

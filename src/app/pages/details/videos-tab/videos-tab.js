import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './videos-tab.html';
import css from './videos-tab.css';

const spec = {
    template,
    css,
    view: {
        classes: ['videos-tab']
    }
};

export default componentType(spec, insertHtmlMixin);

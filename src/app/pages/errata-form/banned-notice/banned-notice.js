import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './banned-notice.html';
import css from './banned-notice.css';

const spec = {
    template,
    css,
    view: {
        classes: ['banned-notice']
    }
};

export default componentType(spec);

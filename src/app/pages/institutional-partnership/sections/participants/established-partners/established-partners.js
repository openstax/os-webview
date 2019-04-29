import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './established-partners.html';
import css from './established-partners.css';

const spec = {
    template,
    css,
    view: {
        classes: ['established-partners']
    }
};

export default componentType(spec);

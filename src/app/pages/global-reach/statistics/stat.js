import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './stat.html';
import css from './stat.css';

const spec = {
    template,
    css,
    view: {
        classes: ['statbox']
    }
};

export default componentType(spec);

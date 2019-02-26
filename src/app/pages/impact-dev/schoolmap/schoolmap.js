import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './schoolmap.html';
import css from './schoolmap.css';

const spec = {
    template,
    css,
    view: {
        classes: ['schoolmapbox']
    }
};

export default componentType(spec);

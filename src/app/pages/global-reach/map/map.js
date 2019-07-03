import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './map.html';
import css from './map.css';

const spec = {
    template,
    css,
    view: {
        classes: ['mapbox']
    }
};

export default componentType(spec);

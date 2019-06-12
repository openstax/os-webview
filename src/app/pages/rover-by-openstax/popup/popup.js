import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './popup.html';
import css from './popup.css';


const spec = {
    template,
    css,
    view: {
        classes: ['transition-popup']
    }
};

export default componentType(spec);

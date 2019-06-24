import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './update-box.html';
import css from './update-box.css';

const spec = {
    template,
    css,
    view: {
        classes: ['update-box']
    }
};

export default componentType(spec);

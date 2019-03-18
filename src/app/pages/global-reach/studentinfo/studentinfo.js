import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './studentinfo.html';
import css from './studentinfo.css';

const spec = {
    template,
    css,
    view: {
        classes: ['studentinfobox']
    }
};

export default componentType(spec);

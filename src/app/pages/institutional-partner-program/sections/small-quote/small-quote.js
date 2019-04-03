import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './small-quote.html';
import css from './small-quote.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['small-quote', 'near-white']
    }
};

export default componentType(spec);

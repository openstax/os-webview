import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './overlapping-quote.html';
import css from './overlapping-quote.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['overlapping-quote', 'near-white']
    }
};

export default componentType(spec);

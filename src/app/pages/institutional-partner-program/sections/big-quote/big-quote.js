import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './big-quote.html';
import css from './big-quote.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['big-quote']
    }
};

export default componentType(spec);

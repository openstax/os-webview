import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './office-hours.html';
import css from './office-hours.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'office-hours',
        classes: ['near-white']
    }
};

export default componentType(spec, insertHtmlMixin);

import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './application.html';

const spec = {
    template,
    view: {
        classes: ['application']
    }
};

export default componentType(spec);

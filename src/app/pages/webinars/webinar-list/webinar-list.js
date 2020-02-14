import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './webinar-list.html';
import css from './webinar-list.css';

const spec = {
    template,
    css,
    view: {
        classes: ['webinar-list']
    },
    model() {
        return {
        };
    }
};

export default class extends componentType(spec) {
}

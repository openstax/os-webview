import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './pulsing-dot.html';
import css from './pulsing-dot.css';

const spec = {
    template,
    css,
    view: {
        classes: ['pulsing-dot']
    },
    model: {
        stopPulsing: false
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    @on('click')
    stopPulsing() {
        this.model.stopPulsing = true;
        this.update();
    }

}

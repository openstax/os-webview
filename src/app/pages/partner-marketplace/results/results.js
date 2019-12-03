import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './results.html';
import css from './results.css';

const spec = {
    template,
    css,
    view: {
        classes: ['results']
    },
    model() {
        return {
            entries: this.entries,
            displayMode: this.displayMode
        };
    }
};

export default class extends componentType(spec, busMixin, insertHtmlMixin) {

    whenPropsUpdated() {
        this.update();
    }

}

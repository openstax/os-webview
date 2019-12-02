import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './results.html';
import css from './results.css';
import {on} from '~/helpers/controller/decorators';

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

    @on('click a.card')
    replaceState(event) {
        const href = event.delegateTarget.href;

        this.emit('select', href);
    }

}

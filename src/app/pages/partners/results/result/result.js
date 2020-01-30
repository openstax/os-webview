import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './result.html';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    view: {
        classes: ['card'],
        tag: 'a'
    }
};

export default class extends componentType(spec, busMixin) {

    onLoaded() {
        this.el.href = this.model.title;
    }

    @on('click')
    replaceState(event) {
        this.emit('select');
        event.preventDefault();
    }

}

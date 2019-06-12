import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './popup.html';
import css from './popup.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['transition-popup']
    }
};

export default class extends componentType(spec, busMixin) {

    onClose() {
        console.info('Closing');
    }

    @on('click [href="cancel"]')
    closeSelf(event) {
        event.preventDefault();
        this.emit('cancel');
    }

};

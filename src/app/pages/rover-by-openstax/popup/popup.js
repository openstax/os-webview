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

    onLoaded() {
        const defaultButton = this.el.querySelector('.btn.blue');

        setTimeout(() => {
            defaultButton.focus();
        }, 100);
    }

    @on('click .close-popup')
    closeSelf(event) {
        event.preventDefault();
        this.emit('cancel');
    }

    @on('keydown .close-popup')
    handleKeyClose(event) {
        if (['Enter', ' '].includes(event.key)) {
            this.closeSelf(event);
        }
    }

    @on('focusout')
    restrictTabbing(event) {
        event.stopPropagation();
        if (!this.el.contains(event.relatedTarget)) {
            this.el.querySelector('[tabindex]').focus();
        }
    }

};

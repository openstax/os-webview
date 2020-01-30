import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './button-with-popover.html';
import css from './button-with-popover.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['button-with-popover']
    },
    model() {
        return {
            label: this.label,
            open: this.open,
            caretDirection: this.open ? 'up' : 'down',
            popoverStyle: this.style
        };
    },
    regions: {
        popover: '.popover'
    }
};

export default class extends componentType(spec, busMixin) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if (this.content) {
            if (this.container) {
                this.container.append(this.content);
            } else {
                this.regions.popover.attach(this.content);
            }
        }
        if (this.style) {
            this.el.classList.add(this.style);
        }
    }

    whenPropsUpdated() {
        this.update();
    }

    onUpdate() {
        if (this.container) {
            if (this.open) {
                this.content.el.style.removeProperty('display');
            } else {
                this.content.el.style.display = 'none';
            }
        }
    }

    @on('click .popover-control')
    toggleOpen() {
        this.emit('toggle', !this.open);
    }

}

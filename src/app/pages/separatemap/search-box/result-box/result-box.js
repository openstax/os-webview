import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './result-box.html';
import css from './result-box.css';
import {on} from '~/helpers/controller/decorators';
import busMixin from '~/helpers/controller/bus-mixin';

const spec = {
    template,
    css,
    view: {
        classes: ['result-box']
    }
};

function scrollIntoView(el) {
    const thisRect = el.getBoundingClientRect();
    const parentEl = el.parentNode;
    const parentRect = parentEl.getBoundingClientRect();

    if (thisRect.top < parentRect.top) {
    }
    if (thisRect.bottom > parentRect.bottom) {
        parentEl.scrollTop += thisRect.bottom - parentRect.bottom;
    }
}

export default class extends componentType(spec, busMixin) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.on('close-if-not', (theOpenOne) => {
            const shouldBeOpen = theOpenOne && (this.info.pk === theOpenOne.pk);

            if (this.model.isOpen !== shouldBeOpen) {
                this.model.isOpen = shouldBeOpen;
                this.update();
            }
            if (this.model.isOpen) {
                scrollIntoView(this.el);
            }
        });
    }

    @on('click .toggle-details')
    toggleIsOpen() {
        this.model.isOpen = !this.model.isOpen;
        this.update();
        this.emit('set-open-result', this.model.isOpen ? this.info : null);
    }

    @on('click .submit-testimonial')
    emitSubmitTestimonial(event) {
        this.testimonialBus.emit('submit-testimonial');
        event.preventDefault();
    }

}

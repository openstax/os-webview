import sectionCreator from './section';
import {description as template} from './faq.html';
import css from './faq.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'faq',
        classes: ['charcoal']
    }
};

function faqEventMixin(superclass) {
    return class extends superclass {

        init(...args) {
            super.init(...args);
            this.model.selectedIndex = null;
            this.model.isOpen = (index) => index.toString() === this.model.selectedIndex;
        }

        @on('click .question')
        toggleQuestion(event) {
            const index = event.delegateTarget.getAttribute('data-index');

            this.model.selectedIndex = (index === this.model.selectedIndex) ? null : index;
            this.update();
        }

    };
}

export default sectionCreator(spec, faqEventMixin);

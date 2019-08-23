import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './faq.html';
import css from './faq.css';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'faq',
        classes: ['charcoal']
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

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

    @on('click .to-top [role="button"]')
    scrollToTop() {
        $.scrollTo(document.querySelector('body'));
    }

}

import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './sticky-footer.html';
import css from './sticky-footer.css';
import {debounce} from 'lodash';

const spec = {
    template,
    view: {
        classes: ['sticky-footer']
    },
    css,
    footerHeight: ''
};

export default class StickyFooter extends componentType(spec, insertHtmlMixin) {

    init(model) {
        super.init();
        this.model = model;
        // Should have leftButton and optional rightButton, each with
        // link, description, and text
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        let lastYOffset = 0;

        this.handleScroll = debounce(() => {
            const newYOffset = window.pageYOffset;
            const distanceFromBottom = document.body.offsetHeight - window.innerHeight - newYOffset;
            const newFooterHeight = (newYOffset < 100) || (distanceFromBottom < 100) ? 'collapsed' : '';
            const switchClass = (oldValue, newValue) => {
                if (oldValue) {
                    this.el.classList.remove(oldValue);
                }
                if (newValue) {
                    this.el.classList.add(newValue);
                }
            };

            if (newFooterHeight !== this.footerHeight) {
                switchClass(this.footerHeight, newFooterHeight);
                this.footerHeight = newFooterHeight;
            }
            lastYOffset = newYOffset;
        }, 80);

        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
        document.getElementById('main').classList.add('with-sticky');
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        window.removeEventListener('scroll', this.handleScroll);
        document.getElementById('main').classList.remove('with-sticky');
    }

}

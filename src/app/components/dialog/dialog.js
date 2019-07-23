import componentType from '~/helpers/controller/init-mixin';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import ModalContent from '../modal-content/modal-content';
import {description as template} from './dialog.html';
import css from './dialog.css';

const spec = {
    template,
    css,
    view: {
        tag: 'dialog'
    },
    regions: {
        main: '.main-region'
    },
    model() {
        this.props = this.getProps();

        return {
            title: this.props.title,
            htmlTitle: this.props.htmlTitle
        };
    }
};

export class Dialog extends componentType(spec) {

    attachContent() {
        if (this.props.content && !this.attached) {
            this.regions.main.append(this.props.content);
            this.attached = true;
        }
    }

    onUpdate() {
        if (this.props.htmlTitle) {
            const el = this.el.querySelector('.html-title');

            el.innerHTML = this.props.htmlTitle;
        }
        if (this.props.customClass) {
            this.el.classList.add(this.props.customClass);
        }
        // Wait for region to be instantiated
        window.requestAnimationFrame(() => {
            this.attachContent();

            // Wait for content to be drawn
            setTimeout(() => {
                const focusableItems = Array.from(this.props.content.el.querySelectorAll($.focusable));
                const first = focusableItems.find((i) => i.offsetParent !== null);

                if (first) {
                    first.focus();
                }
            }, 20);
        });
    }

    onLoaded() {
        this.el.setAttribute('aria-labelledby', 'dialog-title');
        this.el.style.zIndex = 10;
        this.attachContent();
    }

    /* eslint complexity: 0 */
    @on('click .put-away')
    closeDialog() {
        const contentComponent = this.props.content;

        if (contentComponent && contentComponent.el && contentComponent.el.parentNode) {
            contentComponent.el.parentNode.removeChild(contentComponent.el);
        }

        const controllerIndex = this.regions.main.controllers.indexOf(contentComponent);

        this.regions.main.controllers.splice(controllerIndex, 1);

        if (this.props.customClass) {
            this.el.classList.remove(this.props.customClass);
        }
        if (this.handlers && this.handlers.closeDialog) {
            this.handlers.closeDialog();
        }
        this.attached = false;
    }

    @on('keydown')
    closeOnEscape(event) {
        if (event.key === 'Escape') {
            this.closeDialog();
        }
    }

}

// This just composes the Dialog into ModalContent
export default class ModalDialog extends componentType({}) {

    init(getProps, handlers) {
        super.init();
        this.dialog = new Dialog({
            getProps, handlers
        });
    }

    onLoaded() {
        this.mc = new ModalContent({
            content: this.dialog
        });
        this.regions.self.attach(this.mc);
    }

    update() {
        if (this.dialog) {
            this.dialog.update();
        }
    }

    hide() {
        this.mc.hide();
    }

    closeDialog() {
        this.dialog.closeDialog();
        this.hide();
    }

}

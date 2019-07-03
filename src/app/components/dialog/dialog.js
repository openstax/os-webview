import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import ModalContent from '../modal-content/modal-content';
import {description as template} from './dialog.html';
import css from './dialog.css';

class Dialog extends Controller {

    init(getProps, handlers) {
        this.template = template;
        this.getProps = getProps;
        this.handlers = handlers;
        this.css = css;
        this.regions = {
            main: '.main-region'
        };
        this.view = {
            tag: 'dialog'
        };
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();

        return {
            title: this.props.title,
            htmlTitle: this.props.htmlTitle
        };
    }

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

        if (this.handlers && this.handlers.closeDialog) {
            this.handlers.closeDialog();
        }
        if (this.props.customClass) {
            this.el.classList.remove(this.props.customClass);
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
export default class ModalDialog extends Controller {

    init(getProps, handlers) {
        this.dialog = new Dialog(getProps, handlers);
    }

    template() {}

    onLoaded() {
        this.mc = new ModalContent(this.dialog);
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

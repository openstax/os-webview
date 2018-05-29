import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './tab.html';

export default class Tab extends Controller {

    init(tag, getProps, handlers) {
        this.getProps = getProps;
        this.handlers = handlers;
        this.template = template;
        this.view = {
            tag,
            classes: ['tab']
        };
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();
        return {
            label: this.props.label
        };
    }

    onUpdate() {
        this.el.tabIndex = 0;
        this.el.setAttribute('role', 'link');
        if (this.props.selectedLabel === this.props.label) {
            this.el.setAttribute('aria-current', 'page');
        } else {
            this.el.removeAttribute('aria-current');
        }
    }

    @on('click')
    selectThisTab() {
        this.handlers.setSelected(this.props.label);
        this.el.blur();
    }

    @on('keydown')
    selectOnEnterOrSpace(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.selectThisTab();
        }
    }

}

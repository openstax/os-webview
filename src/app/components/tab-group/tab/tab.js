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
        this.el.classList.toggle('selected', this.props.selectedLabel === this.props.label);
    }

    @on('click')
    selectThisTab() {
        this.handlers.setSelected(this.props.label);
    }

}

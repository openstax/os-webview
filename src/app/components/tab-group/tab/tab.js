import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './tab.html';

export default class Tab extends Controller {

    init(getProps) {
        this.getProps = getProps;
        this.updateProps();
        this.template = template;
        this.view = {
            tag: this.props.tag,
            classes: ['tab']
        };
    }

    updateProps() {
        this.props = this.getProps();
        this.model = { label: this.props.label };
    }

    update() {
        this.updateProps();
        super.update();
    }

    onUpdate() {
        this.el.classList.toggle('selected', this.props.selectedLabel === this.props.label);
    }

    @on('click')
    selectThisTab() {
        this.props.setSelected(this.props.label);
    }

}

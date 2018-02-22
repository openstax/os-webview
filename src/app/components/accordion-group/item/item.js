import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './item.html';

export default class AccordionItem extends Controller {

    init(getProps) {
        this.getProps = getProps;
        this.updateProps();
        this.template = template;
        this.view = {
            tag: this.props.tag,
            classes: ['accordion-item']
        };
        this.regions = {
            contentPane: '.content-pane'
        };
    }

    onLoaded() {
        if (this.props.contentComponent) {
            this.regions.contentPane.attach(this.props.contentComponent);
        }
    }

    updateProps() {
        this.props = this.getProps();
        const isOpen = this.props.selectedLabel === this.props.label;

        this.model = {
            label: this.props.label,
            chevronDirection: isOpen ? 'down' : 'right',
            hiddenAttribute: isOpen ? null : ''
        };
    }

    update() {
        this.updateProps();
        super.update();
    }

    @on('click .control-bar')
    selectThisTab(event) {
        if (event.delegateTarget.parentNode === this.el) {
            const isOpen = this.props.selectedLabel === this.props.label;

            this.props.setSelected(isOpen ? null : this.props.label);
            $.scrollTo(this.el);
        }
    }

}

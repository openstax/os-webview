import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './item.html';

export default class AccordionItem extends Controller {

    init(tag, getProps, handlers) {
        this.getProps = getProps;
        this.handlers = handlers;
        this.template = template;
        this.view = {
            // tag,
            classes: ['accordion-item']
        };
        this.regions = {
            contentPane: '.content-pane'
        };
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();
        const isOpen = this.props.selectedLabel === this.props.label;

        return {
            label: isOpen ? this.props.openLabel : this.props.label,
            chevronDirection: isOpen ? 'down' : 'right',
            hiddenAttribute: isOpen ? null : ''
        };
    }

    onLoaded() {
        if (this.props.contentComponent) {
            this.regions.contentPane.attach(this.props.contentComponent);
        }
    }

    @on('click .control-bar')
    selectThisTab(event) {
        if (event.delegateTarget.parentNode === this.el) {
            const isOpen = this.props.selectedLabel === this.props.label;

            this.handlers.setSelected(isOpen ? null : this.props.label);
            if (!isOpen) {
                $.scrollTo(this.el);
            }
        }
    }

}

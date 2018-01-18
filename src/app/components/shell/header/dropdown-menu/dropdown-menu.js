import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './dropdown-menu.html';

export default class DropdownMenu extends Controller {

    init(getProps) {
        this.template = template;
        this.css = '/app/components/shell/header/dropdown-menu.css';
        this.getProps = getProps;
        this.model = {
            props: getProps()
        }
    }

    update() {
        this.model.props = this.getProps();
        console.debug("Isopen?", this.model.props.isOpen);
        super.update();
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}

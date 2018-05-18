import VERSION from '~/version';
import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './mobile-selector.html';

export default class MobileSelector extends Controller {

    init(getProps, onChange) {
        this.template = template;
        this.getProps = getProps;
        this.onChange = onChange;
        this.view = {
            classes: ['mobile-selector']
        };
        this.css = `/app/pages/press/mobile-selector/mobile-selector.css?${VERSION}`;
        this.model = () => this.getModel();
        this.showingMenu = false;
    }

    getModel() {
        this.props = this.getProps();

        return {
            selectedValue: this.props.selectedValue,
            values: this.props.values,
            showingMenu: this.showingMenu,
            selectedClass: (v) => v === this.props.selectedValue ? 'selected' : null
        };
    }

    @on('click .selector-button')
    showMenu() {
        this.showingMenu = true;
        this.update();
    }

    @on('click [role="menuitem"]')
    changeValue(event) {
        this.onChange(event.delegateTarget.textContent);
        this.showingMenu = false;
        this.update();
    }

}

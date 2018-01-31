import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import header from '../../header';
import {description as template} from './dropdown.html';

export default class Dropdown extends Controller {

    init(getProps) {
        this.template = template;
        this.css = '/app/components/shell/header/main-menu/dropdown/dropdown.css';
        this.getProps = getProps;
        this.model = {
            isOpen: false,
            selectedIndex: -1,
            props: getProps()
        };
        this.view = {
            tag: this.model.props.tag || 'div',
            classes: ['nav-menu-item', 'dropdown']
        };
        this.frozen = false;
    }

    onLoaded() {
        this.closeMenuBound = () => {
            if (!this.isMobileDisplay() && !this.frozen) {
                this.closeMenu();
            }
        };
        this.el.addEventListener('mouseleave', this.closeMenuBound);
    }

    onClose() {
        this.el.removeEventListener('mouseleave', this.closeMenuBound);
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

    setFocus() {
        this.settingFocus = true;
        if (this.model.selectedIndex < 0) {
            this.el.querySelector('a').focus();
        } else {
            this.el.querySelectorAll('.dropdown-menu [role="menuitem"]')[this.model.selectedIndex].focus();
        }
        this.settingFocus = false;
    }

    isMobileDisplay() {
        const w = window.innerWidth;

        return w < 960;
    }

    freeze() {
        this.frozen = true;
    }

    unfreeze() {
        this.frozen = false;
    }

    openMenu() {
        this.model.isOpen = true;
        if (this.isMobileDisplay()) {
            header.recognizeDropdownOpen({
                el: this.el,
                label: this.model.props.dropdownLabel,
                close: this.closeMenu.bind(this)
            });
        }
        this.update();
    }

    closeMenu() {
        this.model.isOpen = false;
        header.recognizeDropdownOpen(null);
        this.update();
    }

    @on('focusin')
    @on('mouseover')
    openDesktopMenu() {
        if (!this.isMobileDisplay()) {
            this.openMenu();
        }
    }

    @on('focusout')
    navigateAway() {
        if (!this.isMobileDisplay() && !this.settingFocus) {
            this.closeMenuBound();
        }
    }

    @on('click .dropdown > [role="menuitem"]')
    openMobileMenu(event) {
        event.preventDefault();
        this.openMenu();
    }

    @on('keydown')
    moveSelection(event) {
        /* eslint complexity: 0 */
        const lastIndex = this.model.props.items.length - 1;

        switch (event.keyCode) {
        case $.key.down:
            if (this.model.selectedIndex < lastIndex) {
                ++this.model.selectedIndex;
            }
            event.preventDefault();
            this.setFocus();
            break;
        case $.key.up:
            --this.model.selectedIndex;
            if (this.model.selectedIndex < 0) {
                this.model.selectedIndex = -1;
            }
            event.preventDefault();
            this.setFocus();
            break;
        case $.key.enter:
        case $.key.space:
            document.activeElement.dispatchEvent($.newEvent('click'));
            // Falls through to close
        case $.key.esc:
            document.activeElement.blur();
            this.closeMenuBound();
            break;
        default:
            break;
        }
    }

}

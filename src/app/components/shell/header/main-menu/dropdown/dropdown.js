import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import header from '../../header';
import {description as template} from './dropdown.html';

export default class Dropdown extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.css = `/app/components/shell/header/main-menu/dropdown/dropdown.css?${VERSION}`;
        this.view = {
            classes: ['nav-menu-item', 'dropdown']
        };
        this.frozen = false;
        this.isOpen = false;
        this.selectedIndex = -1;

        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();

        return {
            isOpen: this.isOpen,
            selectedIndex: this.selectedIndex,
            dropdownUrl: this.props.dropdownUrl,
            dropdownLabel: this.props.dropdownLabel,
            items: this.props.items
        };
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
        if (this.selectedIndex < 0) {
            this.el.querySelector('a').focus();
        } else {
            this.el.querySelectorAll('.dropdown-menu [role="menuitem"]')[this.selectedIndex].focus();
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
        if (!this.isOpen) {
            this.isOpen = true;
            if (this.isMobileDisplay()) {
                header.recognizeDropdownOpen({
                    el: this.el,
                    label: this.props.dropdownLabel,
                    close: this.closeMenu.bind(this)
                });
            }
            this.update();
        }
    }

    closeMenu() {
        if (this.isOpen) {
            this.isOpen = false;
            header.recognizeDropdownOpen(null);
            this.update();
        }
    }

    @on('focusin')
    @on('mouseover')
    openDesktopMenu() {
        if (!this.isMobileDisplay()) {
            this.openMenu();
        }
    }

    @on('focusout')
    navigateAway(event) {
        if (event.target === this.el && !this.isMobileDisplay() && !this.settingFocus) {
            this.closeMenuBound(event);
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
        const lastIndex = this.props.items.length - 1;

        switch (event.keyCode) {
        case $.key.down:
            if (this.selectedIndex < lastIndex) {
                ++this.selectedIndex;
            }
            event.preventDefault();
            this.setFocus();
            break;
        case $.key.up:
            --this.selectedIndex;
            if (this.selectedIndex < 0) {
                this.selectedIndex = -1;
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
            event.preventDefault();
            break;
        default:
            break;
        }
    }

}

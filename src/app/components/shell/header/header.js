import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './header.hbs';

@props({
    template: template
})
class Header extends BaseView {

    constructor() {
        super(...arguments);

        this.meta = {};

        this.templateHelpers = {
            collapsed: () => this.meta.collapsed,
            fixed: () => this.meta.fixed,
            transparent: () => this.meta.transparent
        };
    }

    classList(action, ...args) {
        let result = null;
        let header = this.el.querySelector('.page-header');

        if (header && typeof header.classList === 'object') {
            result = header.classList[action](...args);
        }

        return result;
    }

    collapse() {
        this.meta.collapsed = true;
        this.classList('add', 'collapsed');
        return this;
    }

    pin() {
        this.meta.fixed = true;
        this.classList('add', 'fixed');
        return this;
    }

    transparent() {
        this.meta.transparent = true;
        this.classList('add', 'transparent');
        return this;
    }

    reset() {
        this.meta.collapsed = false;
        this.meta.pinned = false;
        this.meta.transparent = false;
        this.classList('remove', 'collapsed');
        this.classList('remove', 'fixed');
        this.classList('remove', 'transparent');
        return this;
    }

    isCollapsed() {
        return !!this.classList('contains', 'collapsed');
    }

    isPinned() {
        return !!this.classList('contains', 'fixed');
    }

    isTransparent() {
        return !!this.classList('contains', 'transparent');
    }

    get height() {
        let header = this.el.querySelector('.page-header');
        let height = 0;

        if (header && typeof header === 'object') {
            height = header.offsetHeight;
        }

        return height;
    }

    get secondaryNavHeight() {
        let secondaryNav = this.el.querySelector('.secondary-nav');
        let height = 0;

        if (secondaryNav && typeof secondaryNav === 'object') {
            height = secondaryNav.offsetHeight;
        }

        return height;
    }

    @on('click nav > a')
    blurLogo(e) {
        e.delegateTarget.blur();
    }

    @on('click .expand-nav')
    toggleNavMenu(e) {
        let button = e.target;
        let header = this.el.querySelector('.page-header');

        button.classList.toggle('active');
        header.classList.toggle('active');
    }

    @on('click .skiptocontent a')
    skipToContent() {
        let el = document.getElementById('maincontent');

        function removeTabIndex() {
            this.removeAttribute('tabindex');
            this.removeEventListener('blur', removeTabIndex, false);
            this.removeEventListener('focusout', removeTabIndex, false);
        }

        if (el) {
            if (!(/^(?:a|select|input|button|textarea)$/i).test(el.tagName)) {
                el.tabIndex = -1;
                el.addEventListener('blur', removeTabIndex, false);
                el.addEventListener('focusout', removeTabIndex, false);
            }

            el.focus();
        }
    }

}

let header = new Header();

export default header;

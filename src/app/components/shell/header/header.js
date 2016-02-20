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

    get metaNavHeight() {
        let metaNav = this.el.querySelector('.meta-nav');
        let height = 0;

        if (metaNav && typeof metaNav === 'object') {
            height = metaNav.offsetHeight;
        }

        return height;
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

    toggleMetaNav(e) {
        let button = e.currentTarget;

        button.classList.toggle('expanded');
        button.setAttribute('aria-expanded', !!button.classList.contains('expanded'));

        for (let a of button.querySelectorAll('a')) {
            if (button.classList.contains('expanded')) {
                a.setAttribute('tabindex', '0');
            } else {
                a.setAttribute('tabindex', '-1');
            }
        }
    }

    @on('click .expand')
    onClickToggleMetaNav(e) {
        this.toggleMetaNav(e);
    }

    @on('keydown .expand')
    onKeydownToggleMetaNav(e) {
        if (document.activeElement === e.currentTarget && (e.keyCode === 13 || e.keyCode === 32)) {
            e.preventDefault();
            this.toggleMetaNav(e);
        }
    }

    @on('focus a[aria-haspopup="true"]')
    openDropdownMenu(e) {
        let menu = e.currentTarget.nextElementSibling;

        menu.setAttribute('aria-expanded', 'true');

        for (let a of menu.querySelectorAll('a')) {
            a.setAttribute('tabindex', '0');
        }
    }

    closeDropdownMenus() {
        let menus = this.el.querySelectorAll('.dropdown-menu');

        for (let menu of menus) {
            if (!menu.contains(document.activeElement)) {
                menu.setAttribute('aria-expanded', 'false');

                for (let a of menu.querySelectorAll('a')) {
                    a.setAttribute('tabindex', '-1');
                }
            }
        }
    }

    onRender() {
        document.addEventListener('focus', this.closeDropdownMenus.bind(this), true);
        document.addEventListener('click', this.closeDropdownMenus.bind(this), true);
    }

    onBeforeClose() {
        document.removeEventListener('focus', this.closeDropdownMenus.bind(this), true);
        document.removeEventListener('click', this.closeDropdownMenus.bind(this), true);
    }

}

let header = new Header();

export default header;

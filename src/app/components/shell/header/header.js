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
            sticky: () => this.meta.sticky,
            transparent: () => this.meta.transparent,
            visible: () => this.meta.visible
        };
    }

    classList(action, ...args) {
        var result = null;
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
        this.meta.sticky = true;
        this.classList('add', 'sticky');
        return this;
    }

    transparent() {
        this.meta.transparent = true;
        this.classList('add', 'transparent');
        return this;
    }

    visible() {
        this.meta.visible = true;
        this.classList('add', 'visible');
        return this;
    }

    reset() {
        this.meta.collapsed = false;
        this.meta.pinned = false;
        this.meta.transparent = false;
        this.meta.visible = false;
        this.classList('remove', 'collapsed');
        this.classList('remove', 'sticky');
        this.classList('remove', 'transparent');
        this.classList('remove', 'visible');

        return this;
    }

    isCollapsed() {
        return !!this.classList('contains', 'collapsed');
    }

    isPinned() {
        return !!this.classList('contains', 'sticky');
    }

    isTransparent() {
        return !!this.classList('contains', 'transparent');
    }
    isVisible() {
        return !!this.classList('contains', 'visible');
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
        let secondaryNav = this.el.querySelector('.meta-nav');
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
        e.stopPropagation();
        let header = this.el.querySelector('.page-header');

        header.classList.toggle('active');
    }

    @on('click .active:not(.open) .main-nav .parent > a')
    addOpen(e) {
        e.stopPropagation();
        e.preventDefault();

        let header = this.el.querySelector('.page-header');
        let $this = e.target;
        let parentItem = $this.parentNode;
        let secondaryNav = e.delegateTarget.nextElementSibling;

        header.classList.add('open');
        parentItem.classList.add('open');
        secondaryNav.classList.add('open');
    }

    @on('click .active .nav-menu-item .back')
    removeOpen(e) {
        e.stopPropagation();
        e.preventDefault();

        let header = this.el.querySelector('.page-header');
        let $this = e.target;
        let secondaryNav = this.el.querySelector('.secondary-nav.open');
        let parentItem = $this.parentNode;

        header.classList.remove('open');
        parentItem.classList.remove('open');
        secondaryNav.classList.remove('open');
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

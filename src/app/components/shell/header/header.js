import Backbone from 'backbone';
import BaseView from '~/helpers/backbone/view';
import userModel from '~/models/usermodel';
import settings from 'settings';
import newsPromise from '~/pages/blog/newsPromise';
import {on, props} from '~/helpers/backbone/decorators';
import linkHelper from '~/helpers/link';
import {template} from './header.hbs';

// NOTE: This needs to be refactored into multiple views

@props({
    template: template,
    css: '/app/components/shell/header/header.css'
})
class Header extends BaseView {

    constructor() {
        super(...arguments);

        this.meta = {};

        this.templateHelpers = () => {
            let accounts = `${settings.apiOrigin}/accounts`;
            let currentPage = Backbone.history.location.href;

            return {
                visible: () => this.meta.visible,
                fixed: () => this.meta.fixed,
                transparent: () => this.meta.transparent,
                login: `${accounts}/login/openstax/?next=${currentPage}`,
                logout: `${accounts}/logout/?next=${currentPage}`
            };
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

    visible() {
        this.meta.visible = true;
        this.classList('add', 'visible');
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
        this.meta.visible = false;
        this.meta.pinned = false;
        this.meta.transparent = false;
        this.classList('remove', 'visible');
        this.classList('remove', 'fixed');
        this.classList('remove', 'transparent');
        return this;
    }

    isVisible() {
        return !!this.classList('contains', 'visible');
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

    toggleFullScreenNav(e) {
        let button = e.currentTarget;
        let header = this.el.querySelector('.page-header');

        document.body.classList.toggle('no-scroll');

        window.requestAnimationFrame(() => {
            header.classList.toggle('active');
            this.removeAllOpenClasses(e);
            this.removeCloneDropdownParent();


            button.classList.toggle('expanded');
            button.setAttribute('aria-expanded', !!button.classList.contains('expanded'));
        });
    }

    removeClass(array, className) {
        let i = 0,
            len = array.length;

        for (; i < len; i++) {
            if (array[i].classList) {
                array[i].classList.remove(className);
            } else {
                let names = array[i].className.split(' '),
                    j = 0,
                    sublen = names.length;

                for (; j < sublen; j++) {
                    if (names[j] === className) {
                        names[j] = '';
                    }
                }
                array[i].className = names.join('');
            }
        }
    }

    removeAllOpenClasses() {
        let header = this.el.querySelector('.page-header');
        let parentItem = this.el.querySelectorAll('.dropdown');
        let dropDownMenu = this.el.querySelectorAll('.dropdown-menu');

        if (header) {
            header.classList.remove('open');
        }
        this.removeClass(parentItem, 'open');
        this.removeClass(dropDownMenu, 'open');
        this.closeDropdownMenus(true);
        this.updateHeaderStyle();
    }

    closeFullScreenNav() {
        let button = this.el.querySelector('.expand');
        let header = this.el.querySelector('.page-header');

        if (header.classList.contains('active')) {
            document.body.classList.remove('no-scroll');
        }

        window.requestAnimationFrame(() => {
            header.classList.remove('active');
            this.removeAllOpenClasses();
            this.removeCloneDropdownParent();

            button.classList.remove('expanded');
            button.setAttribute('aria-expanded', 'false');
        });
    }

    @on('click .expand')
    onClickToggleFullScreenNav(e) {
        this.toggleFullScreenNav(e);
    }

    @on('click .page-header .dropdown > a')
    flyOutMenu(e) {
        let w = window.innerWidth;
        let header = this.el.querySelector('.page-header');
        let $this = e.currentTarget;
        let parentItem = $this.parentNode;
        let dropDownMenu = $this.nextElementSibling;

        if (w <= 768) {
            e.preventDefault();
            e.stopPropagation();
            this.cloneDropdownParent(e);

            if (!dropDownMenu.classList.contains('open')) {
                this.removeAllOpenClasses();
                header.classList.add('open');
                parentItem.classList.add('open');
                dropDownMenu.classList.add('open');
                this.openThisDropdown(e);
            } else if (!e.target.classList.contains('back')) {
                this.closeFullScreenNav(e);
            }
        }
    }

    @on('keydown .expand')
    onKeydownToggleFullScreenNav(e) {
        if (document.activeElement === e.currentTarget && (e.keyCode === 13 || e.keyCode === 32)) {
            e.preventDefault();
            this.toggleFullScreenNav(e);
        }
    }

    openThisDropdown(e) {
        let menu = e.currentTarget.nextElementSibling;

        menu.setAttribute('aria-expanded', 'true');

        for (let a of menu.querySelectorAll('a')) {
            a.setAttribute('tabindex', '0');
        }
    }

    resetHeader(e) {
        let urlClick = e && linkHelper.validUrlClick(e);
        let header = this.el.querySelector('.page-header');

        if (urlClick) {
            if (!urlClick.parentNode.classList.contains('dropdown')) {
                this.closeDropdownMenus(true);
                this.closeFullScreenNav();
            }
        } else if (!header.classList.contains('active')) {
            this.closeFullScreenNav();
        } else {
            this.updateHeaderStyle();
        }
    }

    closeDropdownMenus(all) {
        let menus = this.el.querySelectorAll('.dropdown-menu');

        for (let menu of menus) {
            if (all || !menu.contains(document.activeElement)) {
                menu.setAttribute('aria-expanded', 'false');

                for (let a of menu.querySelectorAll('a')) {
                    a.setAttribute('tabindex', '-1');
                }
            }
        }
    }

    updateHeaderStyle() {
        let height = this.height;

        if (window.pageYOffset > height && !this.isPinned()) {
            this.reset().pin().visible();
        } else if (window.pageYOffset <= height) {
            if (Backbone.history.location.pathname === '/') {
                this.reset().transparent();
            } else {
                this.reset();
            }
        }
    }

    cloneDropdownParent(e) {
        let $this = e.currentTarget;
        let dropdown = $this.nextElementSibling;
        let parent = $this.cloneNode(true);
        let thisLi = document.createElement('li');
        let back = document.createElement('a');
        var element = dropdown.querySelector('.clone');

        thisLi.setAttribute('role', 'presentation');
        thisLi.setAttribute('class', 'clone');

        parent.removeAttribute('href');
        parent.removeAttribute('aria-haspopup');
        back.setAttribute('class', 'back');
        back.text = 'Back';
        thisLi.appendChild(back);
        thisLi.appendChild(parent);

        if (!element) {
            back.addEventListener('click', this.removeAllOpenClasses.bind(this), true);

            dropdown.insertBefore(thisLi, dropdown.childNodes[0]);
        }
    }

    removeCloneDropdownParent() {
        let clone = this.el.querySelectorAll('.clone');

        for (let thisClone of clone) {
            let back = thisClone.querySelector('.back');

            back.removeEventListener('click', this.removeAllOpenClasses.bind(this), true);
            thisClone.parentNode.removeChild(thisClone);
        }
    }

    preventMobileMenuScroll(e) {
        e.preventDefault();
    }

    onRender() {
        newsPromise.then((articles) => {
            let blogLink = this.el.querySelector('a[href="/blog"]').parentNode;

            if (!(articles && articles.pages && articles.pages.length)) {
                blogLink.classList.add('hidden');
            }
        });
        userModel.fetch().then((data) => {
            let loginItem = this.el.querySelector('.meta-nav .container .login a'),
                userInfo = data[0],
                loginWrapper = loginItem.parentNode,
                loggedIn = userInfo && userInfo.username !== '';

            if (loggedIn) {
                loginItem.firstChild.textContent = `Hi ${userInfo.first_name}`;
                loginWrapper.classList.add('dropdown');
                loginItem.setAttribute('aria-haspopup', true);

                loginItem.href = settings.accountHref;

                if (userInfo.groups.indexOf('Faculty') >= 0) {
                    let nonFaculty = this.el.querySelectorAll('.non-faculty');

                    for (let item of nonFaculty) {
                        item.classList.add('hidden');
                    }
                }

                this.attachListenerTo(loginItem, 'click', this.flyOutMenu.bind(this));
            } else {
                loginItem.firstChild.textContent = 'Login';
            }
        });
        this.updateHeaderStyle();
        this.el.querySelector('[data-href-setting="account-href"]').href = settings.accountHref;
        this.attachListenerTo(document, 'click', this.resetHeader.bind(this), true);
        this.attachListenerTo(window, 'scroll', () =>
            window.requestAnimationFrame(this.updateHeaderStyle.bind(this))
        );
        this.attachListenerTo(window, 'scroll', () =>
            window.requestAnimationFrame(this.removeAllOpenClasses.bind(this))
        );
        this.attachListenerTo(window, 'resize', this.closeFullScreenNav.bind(this));
        document.body.classList.remove('no-scroll');

        // prevent scrolling on iOS when mobile menu is active
        let header = document.querySelector('.page-header');

        header.addEventListener('touchmove', this.preventMobileMenuScroll.bind(this), false);
    }
}

let header = new Header();

export default header;

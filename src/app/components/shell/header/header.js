import {Controller} from 'superb';
import stickyNote from '../sticky-note/sticky-note';
import UpperMenu from './upper-menu/upper-menu';
import MainMenu from './main-menu/main-menu';
import settings from 'settings';
import {on} from '~/helpers/controller/decorators';
import linkHelper from '~/helpers/link';
import userModel from '~/models/usermodel';
import {description as template} from './header.html';

class Header extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/shell/header/header.css';
        this.view = {
            tag: 'header',
            classes: ['page-header']
        };
        this.regions = {
            stickyNote: 'sticky-note',
            upperMenu: 'nav.meta-nav',
            mainMenu: 'nav.nav'
        };

        // Fix: There must be a better way
        const padParentForStickyNote = () => {
            const stickyNoteEl = this.el.querySelector('sticky-note');

            if (stickyNoteEl) {
                const h = stickyNoteEl.offsetHeight;

                this.el.parentNode.style.minHeight = `${h}px`;
            }
        };

        this.model = () => {
            const accounts = `${settings.apiOrigin}/accounts`;
            const currentPage = window.location.href;

            return {
                login: `${accounts}/login/openstax/?next=${currentPage}`,
                logout: `${accounts}/logout/?next=${currentPage}`,
                user: this.user || {
                    username: null,
                    groups: []
                },
                accountLink: settings.accountHref
            };
        };

        userModel.load().then((user) => {
            if (typeof user === 'object') {
                this.user = user;
            }
            this.update();
        });

        document.addEventListener('click', this.resetHeader.bind(this));
        window.addEventListener('resize', this.closeFullScreenNav.bind(this));
        window.addEventListener('resize', padParentForStickyNote);
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(() => {
                this.updateHeaderStyle();
                this.removeAllOpenClasses();
            });
        });

        this.handlePathChange = () => {
            if (window.location.pathname === '/give/form') {
                localStorage.visitedGive = Date.now();
            } else if (window.location.pathname === '/') {
                localStorage.visitedGive = Number(localStorage.visitedGive || 0) + 1;
            }
            this.update();
        };
        window.addEventListener('popstate', this.handlePathChange);
        // Custom event created by router, because it does not emit popstate
        // for forward navigation on IE or Safari
        window.addEventListener('navigate', this.handlePathChange);
    }

    onUpdate() {
        const path = window.location.pathname;
        const visitedGive = Number(localStorage.visitedGive || 0) > 10;
        const hideSticky = (path !== '/' || visitedGive);

        this.el.querySelector('sticky-note').classList.toggle('hidden', hideSticky);
    }

    onLoaded() {
        this.regions.stickyNote.append(stickyNote);
        this.regions.upperMenu.attach(new UpperMenu(this.model));
        this.regions.mainMenu.attach(new MainMenu(this.model));
    }

    visible() {
        this.el.classList.add('visible');
        return this;
    }

    pin() {
        this.el.classList.add('fixed');
        return this;
    }

    transparent() {
        this.el.classList.add('transparent');
        return this;
    }

    reset() {
        this.el.classList.remove('visible');
        this.el.classList.remove('fixed');
        this.el.classList.remove('transparent');
        return this;
    }

    isPinned() {
        return this.el.classList.contains('fixed');
    }

    get height() {
        let height = 0;

        if (this.el && typeof this.el === 'object') {
            height = this.el.offsetHeight;
        }

        return height;
    }

    @on('click .skiptocontent a')
    skipToContent() {
        const el = document.getElementById('maincontent');

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

    toggleFullScreenNav(button) {
        document.body.classList.toggle('no-scroll');

        window.requestAnimationFrame(() => {
            this.el.classList.toggle('active');
            this.removeAllOpenClasses();
            this.removeCloneDropdownParent();


            button.classList.toggle('expanded');
            button.setAttribute('aria-expanded', !!button.classList.contains('expanded'));
        });
    }

    removeClass(array, className) {
        const len = array.length;

        for (let i = 0; i < len; i++) {
            if (array[i].classList) {
                array[i].classList.remove(className);
            } else {
                const names = array[i].className.split(' ')
                .filter((name) => name !== className);

                array[i].className = names.join('');
            }
        }
    }

    removeAllOpenClasses() {
        const parentItem = this.el.querySelectorAll('.dropdown');
        const dropDownMenu = this.el.querySelectorAll('.dropdown-menu');

        if (this.el) {
            this.el.classList.remove('open');
        }
        this.removeClass(parentItem, 'open');
        this.removeClass(dropDownMenu, 'open');
        this.closeDropdownMenus(true);
        this.updateHeaderStyle();
    }

    closeFullScreenNav() {
        const button = this.el.querySelector('.expand');

        if (this.el.classList.contains('active')) {
            document.body.classList.remove('no-scroll');
        }

        window.requestAnimationFrame(() => {
            this.el.classList.remove('active');
            this.removeAllOpenClasses();
            this.removeCloneDropdownParent();

            button.classList.remove('expanded');
            button.setAttribute('aria-expanded', 'false');
        });
    }

    @on('click .expand')
    onClickToggleFullScreenNav(e) {
        e.stopPropagation();
        this.toggleFullScreenNav(e.target);
    }

    @on('click .page-header .dropdown > a')
    flyOutMenu(e) {
        const w = window.innerWidth;
        const $this = e.target;
        const parentItem = $this.parentNode;
        const dropDownMenu = $this.nextElementSibling;

        if (w <= 768) {
            e.preventDefault();
            e.stopPropagation();
            this.cloneDropdownParent(e);

            if (!dropDownMenu.classList.contains('open')) {
                this.removeAllOpenClasses();
                this.el.classList.add('open');
                parentItem.classList.add('open');
                dropDownMenu.classList.add('open');
                this.openThisDropdown(dropDownMenu);
            } else if (!e.target.classList.contains('back')) {
                this.closeFullScreenNav(e);
            }
        }
    }

    @on('keydown .expand')
    onKeydownToggleFullScreenNav(e) {
        if (document.activeElement === e.target && (e.keyCode === 13 || e.keyCode === 32)) {
            e.preventDefault();
            this.toggleFullScreenNav(e.target);
        }
    }

    openThisDropdown(menu) {
        menu.setAttribute('aria-expanded', 'true');

        for (const a of menu.querySelectorAll('a')) {
            a.setAttribute('tabindex', '0');
        }
    }

    resetHeader(e) {
        const urlClick = e && linkHelper.validUrlClick(e);

        if (urlClick) {
            if (!urlClick.parentNode.classList.contains('dropdown')) {
                this.closeDropdownMenus(true);
                this.closeFullScreenNav();
            }
        } else if (!this.el.classList.contains('active')) {
            this.closeFullScreenNav();
        } else {
            this.updateHeaderStyle();
        }
    }

    closeDropdownMenus(all) {
        const menus = this.el.querySelectorAll('.dropdown-menu');

        for (const menu of menus) {
            if (all || !menu.contains(document.activeElement)) {
                menu.setAttribute('aria-expanded', 'false');

                for (const a of menu.querySelectorAll('a')) {
                    a.setAttribute('tabindex', '-1');
                }
            }
        }
    }

    updateHeaderStyle() {
        const height = this.height;

        if (window.pageYOffset > height && !this.isPinned()) {
            this.reset().pin().visible();
        } else if (window.pageYOffset <= height) {
            if (window.location.pathname === '/') {
                this.reset().transparent();
            } else {
                this.reset();
            }
        }
    }

    cloneDropdownParent(e) {
        const $this = e.target;
        const dropdown = $this.nextElementSibling;
        const parent = $this.cloneNode(true);
        const thisLi = document.createElement('li');
        const back = document.createElement('a');
        const element = dropdown.querySelector('.clone');

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
        const clone = this.el.querySelectorAll('.clone');

        for (const thisClone of clone) {
            const back = thisClone.querySelector('.back');

            back.removeEventListener('click', this.removeAllOpenClasses.bind(this), true);
            thisClone.parentNode.removeChild(thisClone);
        }
    }

}

const header = new Header();

export default header;

import {Controller} from 'superb';
import stickyNote from '../sticky-note/sticky-note';
import UpperMenu from './upper-menu/upper-menu';
import MainMenu from './main-menu/main-menu';
import settings from 'settings';
import {on} from '~/helpers/controller/decorators';
import linkHelper from '~/helpers/link';
import userModel, {sfUserModel} from '~/models/usermodel';
import {description as template} from './header.html';

class Header extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/shell/header/header.css';
        this.view = {
            tag: 'header',
            classes: ['page-header', 'hide-until-loaded']
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

        const accounts = `${settings.apiOrigin}/accounts`;
        const encodedLocation = encodeURIComponent(window.location.href);

        this.model = {
            login: `${accounts}/login/openstax/?r=${encodedLocation}`,
            logout: `${accounts}/logout/?r=${encodedLocation}`,
            user: {
                username: null,
                groups: []
            },
            accountLink: `${settings.accountHref}/profile`,
            facultyAccessLink: `${settings.accountHref}/faculty_access/apply`,
            currentDropdown: null
        };

        this.upperMenu = new UpperMenu(this.model);
        this.mainMenu = new MainMenu();

        userModel.load().then((response) => {
            const handleUser = (user) => {
                if (typeof user === 'object') {
                    this.model.user = user;
                }
                this.update();
                this.upperMenu.update();
            };

            if (typeof user === 'object' && response.groups.length === 0) {
                console.log('Calling sfUserModel in menu');
                sfUserModel.load().then(handleUser);
            } else {
                handleUser(response);
            }
        });

        document.addEventListener('click', this.resetHeader.bind(this));
        window.addEventListener('resize', this.closeFullScreenNav.bind(this));
        window.addEventListener('resize', padParentForStickyNote);
        window.addEventListener('navigate', () => this.update());
    }

    onUpdate() {
        const path = window.location.pathname;
        const visitedGive = Number(localStorage.visitedGive || 0) > 5;
        const hideSticky = (path !== '/' || (!stickyNote.model.temporary && visitedGive));

        this.el.querySelector('sticky-note').classList.toggle('hidden', hideSticky);
    }

    onLoaded() {
        this.regions.stickyNote.append(stickyNote);
        this.regions.upperMenu.attach(this.upperMenu);
        this.regions.mainMenu.attach(this.mainMenu);
        // Prevent elements from showing up as they load
        setTimeout(() => this.el.classList.add('loaded'), 100);

        let ticking = false;

        this.removeAllOpenClassesOnScroll = () => {
            this.removeAllOpenClasses();
            ticking = false;
        };

        this.onScrollHeader = (evt) => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(this.removeAllOpenClassesOnScroll);
            }
        };

        window.addEventListener('scroll', this.onScrollHeader, false);
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
        this.el.classList.toggle('active');
        this.removeAllOpenClasses();

        button.classList.toggle('expanded');
        button.setAttribute('aria-expanded', !!button.classList.contains('expanded'));
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

        this.el.classList.remove('active');
        this.removeAllOpenClasses();

        button.classList.remove('expanded');
        button.setAttribute('aria-expanded', 'false');
    }

    @on('click .expand')
    onClickToggleFullScreenNav(e) {
        e.stopPropagation();
        this.toggleFullScreenNav(e.target);
    }

    @on('click .dropdown > a')
    flyOutMenu(e) {
        const w = window.innerWidth;
        const $this = e.target;
        const parentItem = $this.parentNode;
        const dropDownMenu = $this.nextElementSibling;

        if (w <= 768) {
            e.preventDefault();
            e.stopPropagation();
            if (!dropDownMenu.classList.contains('open')) {
                this.removeAllOpenClasses();
                this.el.classList.add('open');
                parentItem.classList.add('open');
                dropDownMenu.classList.add('open');
                this.openThisDropdown(dropDownMenu);
            }
        }
    }

    @on('click .submenu-zone .close')
    closeSubmenu(e) {
        this.removeAllOpenClasses();
        e.preventDefault();
        e.stopPropagation();
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
        const target = e.target;

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
            this.reset().pin();
        } else if (window.pageYOffset <= height) {
            if (window.location.pathname === '/') {
                this.reset().transparent();
            } else {
                this.reset();
            }
        }
    }

}

const header = new Header();

export default header;

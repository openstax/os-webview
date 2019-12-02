import {Controller} from 'superb.js';
import stickyNote from '../sticky-note/sticky-note';
import UpperMenu from './upper-menu/upper-menu';
import MainMenu from './main-menu/main-menu';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './header.html';
import css from './header.css';
import bus from './bus';

class Header extends Controller {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            tag: 'header',
            classes: ['page-header', 'hide-until-loaded']
        };
        this.regions = {
            stickyNote: 'sticky-note',
            upperMenu: 'nav.meta-nav',
            mainMenu: 'nav.nav'
        };

        this.model = {
            user: {
                username: null,
                groups: []
            },
            submenuName: 'Name goes here',
            headerActive: false
        };

        this.upperMenu = new UpperMenu();
        this.mainMenu = new MainMenu();
        this.stickyDisplayedOnPage = window.location.pathname;

        window.addEventListener('resize', this.closeFullScreenNav.bind(this));
    }

    onUpdate() {
        const currentPage = window.location.pathname;
        const stickyUpdate = currentPage !== this.stickyDisplayedOnPage;

        if (stickyUpdate !== this.lastStickyUpdate) {
            stickyNote.forceHide(stickyUpdate);
            this.lastStickyUpdate = stickyUpdate;
        }
        this.el.classList.toggle('active', this.model.headerActive);
        this.mainMenu.update();
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
            this.updateHeaderStyle();
            ticking = false;
        };

        this.onScrollHeader = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(this.removeAllOpenClassesOnScroll);
            }
        };

        window.addEventListener('scroll', this.onScrollHeader, false);
        window.addEventListener('navigate', () => {
            this.closeFullScreenNav();
            this.update();
        });
    }

    pin() {
        if (!this.el.classList.contains('fixed')) {
            this.el.classList.add('fixed');
            setTimeout(() => {
                window.dispatchEvent(new Event('resize', {bubbles: true}));
            }, 800);
        }
        return this;
    }

    reset() {
        if (this.el.classList.contains('fixed')) {
            this.el.classList.remove('fixed');
            window.dispatchEvent(new Event('resize', {bubbles: true}));
        }
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

    resetDropdownTop() {
        if (this.currentDropdown) {
            this.currentDropdown.el.style.top = '';
        }
    }

    recognizeDropdownOpen(openDropdown) {
        const isOpen = Boolean(openDropdown);
        const zoneEl = this.el.querySelector('.submenu-zone');

        this.resetDropdownTop();
        this.el.classList.toggle('open', isOpen);
        if (openDropdown) {
            this.model.submenuName = openDropdown.label;
            this.update();
        }

        // Adjust top of dropdown
        if (isOpen) {
            const zoneRect = zoneEl.getBoundingClientRect();
            const ddRect = openDropdown.el.getBoundingClientRect();
            const diff = zoneRect.bottom - ddRect.top - 30;

            openDropdown.el.style.top = `${diff}px`;
        }
        this.currentDropdown = openDropdown;
    }

    toggleFullScreenNav(button) {
        const wasActive = this.model.headerActive;
        const reconfigure = () => {
            document.body.classList.toggle('no-scroll');
            this.model.headerActive = !this.model.headerActive;
            this.update();
            this.removeAllOpenClasses();
        };


        this.el.style.transition = 'none';
        if (wasActive) {
            $.fade(this.el, {fromOpacity: 1, toOpacity: 0}).then(() => {
                reconfigure();
                this.el.style.opacity = 1;
                this.el.style.transition = null;
            });
        } else {
            this.el.style.opacity = 0;
            reconfigure();
            $.fade(this.el, {fromOpacity: 0, toOpacity: 1}).then(() => {
                this.el.style.transition = null;
            });
        }
    }

    removeAllOpenClasses() {
        bus.emit('close-menus');
        this.resetDropdownTop();
    }

    @on('click .nav-menu-item:not(.dropdown) [role="menuitem"]')
    @on('click .dropdown-container [role="menuitem"]')
    closeFullScreenNav() {
        const button = this.el.querySelector('.expand');

        if (this.model.headerActive) {
            document.body.classList.remove('no-scroll');
        }

        this.model.headerActive = false;
        this.update();
        this.removeAllOpenClasses();

        button.setAttribute('aria-expanded', 'false');
    }

    @on('click .expand')
    onClickToggleFullScreenNav(e) {
        e.stopPropagation();
        this.toggleFullScreenNav(e.delegateTarget);
    }

    @on('keydown .expand')
    onKeydownToggleFullScreenNav(e) {
        const target = e.delegateTarget;

        if (document.activeElement === target && [$.key.space, $.key.enter].includes(e.keyCode)) {
            e.preventDefault();
            this.toggleFullScreenNav(target);
        }
    }

    @on('click .submenu-zone .close')
    closeSubmenu() {
        if (this.currentDropdown) {
            this.currentDropdown.close();
            this.resetDropdownTop();
        }
    }

    @on('click .skiptocontent')
    skipToContent(event) {
        event.preventDefault();
        const mainEl = document.getElementById('main');
        const focusableItems = Array.from(mainEl.querySelectorAll($.focusable));

        if (focusableItems.length > 0) {
            const target = focusableItems[0];

            $.scrollTo(target);
            target.focus();
        }
    }

    updateHeaderStyle() {
        const height = this.height;
        const windowTop = window.pageYOffset;
        const blinkThreshold = 27; // threshold to avoid blinking - half the menu height

        if (windowTop <= height - blinkThreshold) {
            this.reset();
        } else if (windowTop > height + blinkThreshold && !this.isPinned()) {
            const oldHeight = document.body.scrollHeight; // next line changes body height

            this.reset().pin();
            // Scroll to where you were relative to the bottom of the document
            window.scrollTo(0, document.body.scrollHeight - oldHeight + windowTop);
        }
    }

}

const header = new Header();

bus.on('recognizeDropdownOpen', header.recognizeDropdownOpen.bind(header));

export default header;

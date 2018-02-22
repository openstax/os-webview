import {Controller} from 'superb.js';
import stickyNote from '../sticky-note/sticky-note';
import UpperMenu from './upper-menu/upper-menu';
import MainMenu from './main-menu/main-menu';
import settings from 'settings';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import linkHelper from '~/helpers/link';
import userModel, {sfUserModel, accountsModel} from '~/models/usermodel';
import {description as template} from './header.html';

class Header extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/shell/header/header.css?v2.6.0';
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

        this.model = {
            login: `${accounts}/login/openstax/`,
            logout: `${accounts}/logout/`,
            user: {
                username: null,
                groups: []
            },
            accountLink: `${settings.accountHref}/profile`,
            facultyAccessLink: `${settings.accountHref}/faculty_access/apply`,
            currentDropdown: null,
            submenuName: 'Name goes here'
        };

        this.upperMenu = new UpperMenu(this.model);
        this.mainMenu = new MainMenu(this.model);

        const pollAccounts = () => {
            const userPollInterval = setInterval(() => {
                accountsModel.load().then((accountResponse) => {
                    const foundTutor = accountResponse.applications
                        .find((app) => app.name === 'OpenStax Tutor');

                    if (foundTutor) {
                        if (!this.model.user.groups.includes('Tutor')) {
                            this.model.user.groups.push('Tutor');
                        }
                        this.update();
                        this.mainMenu.showTutorTrainingWheel();
                        clearInterval(userPollInterval);
                    }
                });
            }, 60000);
        };

        userModel.load().then((response) => {
            const handleUser = (user) => {
                if (typeof user === 'object') {
                    this.model.user = user;
                }
                this.update();
                this.mainMenu.update();
                if (user.accounts_id) {
                    if (
                        user.groups.includes('Tutor') &&
                        !localStorage.hasSeenTutorTrainingWheel
                    ) {
                        this.mainMenu.showTutorTrainingWheel();
                        localStorage.setItem('hasSeenTutorTrainingWheel', true);
                    }
                    if (!user.groups.includes('Tutor')) {
                        pollAccounts();
                    }
                }
            };

            if (typeof response === 'object' && response.groups.length === 0) {
                sfUserModel.load().then(handleUser);
            } else {
                handleUser(response);
            }
        });

        window.addEventListener('resize', this.closeFullScreenNav.bind(this));
        window.addEventListener('resize', padParentForStickyNote);
        window.addEventListener('navigate', () => this.update());
    }

    onUpdate() {
        stickyNote.forceHide(window.location.pathname !== '/');
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
    }

    pin() {
        if (!this.el.classList.contains('fixed')) {
            this.el.classList.add('fixed');
            setTimeout(() => {
                window.dispatchEvent($.newEvent('resize'));
            }, 800);
        }
        return this;
    }

    transparent() {
        this.el.classList.add('transparent');
        return this;
    }

    reset() {
        if (this.el.classList.contains('fixed')) {
            this.el.classList.remove('fixed');
            window.dispatchEvent($.newEvent('resize'));
        }
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
        const wasActive = this.el.classList.contains('active');
        const reconfigure = () => {
            button.setAttribute('aria-expanded', !wasActive);
            document.body.classList.toggle('no-scroll');
            this.el.classList.toggle('active');
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
        this.mainMenu.closeDropdowns();
        this.resetDropdownTop();
    }

    @on('click .nav-menu-item:not(.dropdown) [role="menuitem"]')
    @on('click .dropdown-container [role="menuitem"]')
    closeFullScreenNav() {
        const button = this.el.querySelector('.expand');

        if (this.el.classList.contains('active')) {
            document.body.classList.remove('no-scroll');
        }

        this.el.classList.remove('active');
        this.removeAllOpenClasses();

        button.setAttribute('aria-expanded', 'false');
    }

    @on('click .expand')
    onClickToggleFullScreenNav(e) {
        e.stopPropagation();
        this.toggleFullScreenNav(e.target);
    }

    @on('keydown .expand')
    onKeydownToggleFullScreenNav(e) {
        if (document.activeElement === e.target && [$.key.space, $.key.enter].includes(e.keyCode)) {
            e.preventDefault();
            this.toggleFullScreenNav(e.target);
        }
    }

    @on('click .submenu-zone .close')
    closeSubmenu() {
        if (this.currentDropdown) {
            this.currentDropdown.close();
            this.resetDropdownTop();
        }
    }

    // Left and right arrows go through menu items
    @on('keydown a[role="menuitem"]:focus')
    nextOrPrevious(event) {
        const target = event.target;
        const isDropdownItem = target.parentNode.classList.contains('dropdown');
        const container = isDropdownItem ? target.parentNode.parentNode : target.parentNode;

        if (event.keyCode === $.key.left) {
            container.previousSibling && container.previousSibling.querySelector('[role="menuitem"]').focus();
        }
        if (event.keyCode === $.key.right) {
            container.nextSibling && container.nextSibling.querySelector('[role="menuitem"]').focus();
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

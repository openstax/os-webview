import {Controller} from 'superb.js';
import {description as template} from './main-menu.html';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import categoryPromise from '~/models/subjectCategories';
import Dropdown from './dropdown/dropdown';
import settings from 'settings';
import css from './main-menu.css';

// Slightly hacky; avoiding adding a new item to settings,
// but probably will do so eventually
const dqMatch = settings.accountHref.match(/-[^.]+/);
const domainQualifier = dqMatch ? dqMatch[0] : '';
const tutorDomain = `https://tutor${domainQualifier}.openstax.org/dashboard`;

export default class MainMenu extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['container']
        };
        this.regions = {
            subjectsDropdown: '.subjects-dropdown',
            technologyDropdown: '.technology-dropdown',
            whatWeDoDropdown: '.what-we-do-dropdown'
        };
        this.css = css;
        this.model = model;

        this.loginUrl = this.model.login;
        this.logoutUrl = this.model.logout;
    }

    updateLoginUrl() {
        this.model.login = `${this.loginUrl}?next=${encodeURIComponent(window.location.href)}`;
        this.model.logout = `${this.logoutUrl}?next=${encodeURIComponent(window.location.href)}`;
        this.update();
    }

    onLoaded() {
        this.model.initialRenderDone = true;
        categoryPromise.then((categories) => {
            const items = categories.map((obj) => ({
                url: `/subjects/${obj.value}`,
                label: obj.html.replace('View ', '')
            }));

            this.regions.subjectsDropdown.attach(new Dropdown({
                getProps() {
                    return {
                        dropdownLabel: 'Subjects',
                        items
                    };
                }
            }));
        });
        this.regions.technologyDropdown.attach(new Dropdown({
            getProps() {
                return {
                    dropdownLabel: 'Technology',
                    items: [
                        {url: '/technology', label: 'Technology Options'},
                        {url: '/openstax-tutor', label: 'OpenStax Tutor'},
                        {url: '/rover-by-openstax', label: 'Rover by OpenStax'},
                        {url: '/partners', label: 'OpenStax Partners'}
                    ]
                };
            }
        }));
        this.regions.whatWeDoDropdown.attach(new Dropdown({
            getProps() {
                return {
                    dropdownLabel: 'What we do',
                    items: [
                        {url: '/about', label: 'About Us'},
                        {url: '/team', label: 'Team'},
                        {url: '/research', label: 'Research'},
                        {url: '/institutional-partnership', label: 'Institutional Partnerships'}
                    ]
                };
            }
        }));

        window.addEventListener('navigate', () => this.updateLoginUrl());
        this.updateLoginUrl();
    }

    onUpdate() {
        /* eslint complexity: 0 */
        if (this.model.user.username && !this.loginMenuComponent) {
            const Region = this.regions.self.constructor;
            const regionEl = this.el.querySelector('.login-dropdown');
            const loginRegion = new Region(regionEl, this);
            const model = this.model;
            const tutorItem = {
                url: tutorDomain,
                label: 'OpenStax Tutor'
            };
            const loginItems = [
                {url: this.model.accountLink, label: 'Account Profile'},
                tutorItem,
                {url: this.model.facultyAccessLink, label: 'Request instructor access'},
                {
                    url: this.model.logout,
                    label: 'Log out',
                    isLocal: true
                }
            ];

            if (this.model.user.groups.includes('Faculty') ||
                this.model.user.groups.includes('Student') ||
                this.model.user.pending_verification) {
                loginItems.splice(2, 1);
            }

            this.loginMenuComponent = new Dropdown({
                getProps: () => ({
                    dropdownUrl: this.model.accountLink,
                    dropdownLabel: `Hi ${this.model.user.first_name || this.model.user.username}`,
                    items: loginItems
                })
            });
            loginRegion.attach(this.loginMenuComponent);
        }
    }

    closeDropdowns() {
        const callCloseMenu = (controller) => {
            if (controller) {
                controller.closeMenu();
            }
        };

        ['subjectsDropdown', 'technologyDropdown', 'whatWeDoDropdown']
            .forEach((c) => {
                const region = this.regions[c];

                region && callCloseMenu(region.controllers[0]);
            });
        callCloseMenu(this.loginMenuComponent);
    }

}

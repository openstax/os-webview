import VERSION from '~/version';
import categoryPromise from '~/models/subjectCategories';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import Dropdown from './dropdown/dropdown';
import {description as template} from './main-menu.html';

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
        this.css = `/app/components/shell/header/main-menu/main-menu.css?${VERSION}`;
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

            this.regions.subjectsDropdown.attach(new Dropdown(
                () => ({
                    dropdownLabel: 'Subjects',
                    items
                })
            ));
        });
        this.regions.technologyDropdown.attach(new Dropdown(
            () => ({
                dropdownLabel: 'Technology',
                items: [
                    {url: '/technology', label: 'Technology Options'},
                    {url: '/openstax-tutor', label: 'About OpenStax Tutor'},
                    {url: '/partners', label: 'OpenStax Partners'}
                ]
            })
        ));
        this.regions.whatWeDoDropdown.attach(new Dropdown(
            () => ({
                dropdownLabel: 'What we do',
                items: [
                    {url: '/about', label: 'About Us'},
                    {url: '/team', label: 'Team'},
                    {url: '/research', label: 'Research'}
                ]
            })
        ));

        window.addEventListener('navigate', () => this.updateLoginUrl());
        this.updateLoginUrl();
    }

    showTutorTrainingWheel() {
        this.model.trainingWheelActive = true;
        this.update();
    }

    onUpdate() {
        /* eslint complexity: 0 */
        if (this.model.user.username) {
            const Region = this.regions.self.constructor;
            const regionEl = this.el.querySelector('.login-dropdown');
            const loginRegion = new Region(regionEl, this);
            const tutorItem = {url: 'https://tutor.openstax.org/', label: 'OpenStax Tutor'};
            const loginItems = [
                {url: this.model.accountLink, label: 'Account Profile'},
                tutorItem,
                {url: this.model.facultyAccessLink, label: 'Request instructor access'},
                {
                    url: this.model.logout,
                    label: 'Logout',
                    isLocal: true
                }
            ];

            if (this.model.user.groups.includes('Faculty') ||
                this.model.user.groups.includes('Student') ||
                this.model.user.pending_verification) {
                loginItems.splice(2, 1);
            }

            if (this.model.trainingWheelActive) {
                tutorItem.trainingWheel = true;
            }

            this.loginMenuComponent = new Dropdown(
                () => ({
                    dropdownUrl: this.model.accountLink,
                    dropdownLabel: `Hi ${this.model.user.first_name || this.model.user.username}`,
                    items: loginItems
                })
            );
            loginRegion.attach(this.loginMenuComponent);

            if (this.model.trainingWheelActive) {
                this.loginMenuComponent.freeze();
                this.loginMenuComponent.openMenu();
            }
        }
    }

    closeDropdowns() {
        if (!this.model.trainingWheelActive && this.regions.subjectsDropdown.controllers.length) {
            this.regions.subjectsDropdown.controllers[0].closeMenu();
            this.regions.technologyDropdown.controllers[0].closeMenu();
            this.regions.whatWeDoDropdown.controllers[0].closeMenu();
            if (this.loginMenuComponent) {
                this.loginMenuComponent.closeMenu();
            }
        }
    }

    @on('click .training-wheel .put-away')
    @on('click .training-wheel button')
    putAwayTrainingWheel() {
        this.model.trainingWheelActive = false;
        this.update();
    }

}

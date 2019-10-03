import {Controller} from 'superb.js';
import {description as template} from './main-menu.html';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import categoryPromise from '~/models/subjectCategories';
import Dropdown from './dropdown/dropdown';
import attachLoginMenu from './login-menu/login-menu';
import settings from 'settings';
import css from './main-menu.css';

export default class MainMenu extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['container']
        };
        this.regions = {
            subjectsDropdown: '.subjects-dropdown',
            technologyDropdown: '.technology-dropdown',
            whatWeDoDropdown: '.what-we-do-dropdown',
            loginMenu: '.login-menu'
        };
        this.css = css;
    }

    onLoaded() {
        categoryPromise.then((categories) => {
            const items = categories.map((obj) => ({
                url: `/subjects/${obj.value}`,
                label: obj.html.replace('View ', '')
            }));

            this.regions.subjectsDropdown.attach(new Dropdown({
                dropdownLabel: 'Subjects',
                items
            }));
        });
        this.regions.technologyDropdown.attach(new Dropdown({
            dropdownLabel: 'Technology',
            items: [
                {url: '/technology', label: 'Technology Options'},
                {url: '/openstax-tutor', label: 'OpenStax Tutor'},
                {url: '/rover-by-openstax', label: 'Rover by OpenStax'},
                {url: '/partners', label: 'OpenStax Partners'}
            ]
        }));
        this.regions.whatWeDoDropdown.attach(new Dropdown({
            dropdownLabel: 'What we do',
            items: [
                {url: '/about', label: 'About Us'},
                {url: '/team', label: 'Team'},
                {url: '/research', label: 'Research'},
                {url: '/institutional-partnership', label: 'Institutional Partnerships'}
            ]
        }));
        attachLoginMenu(this.regions.loginMenu.el);
    }

}

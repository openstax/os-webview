import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './main-menu.html';

export default class MainMenu extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['container']
        };
        this.css = '/app/components/shell/header/main-menu/main-menu.css';
        this.model = model;
        this.model.openDropdown = null;
    }

    onLoaded() {
        this.model.initialRenderDone = true;
    }

    showTutorTrainingWheel() {
        this.model.trainingWheelActive = true;
        this.update();
    }

    onUpdate() {
        if (this.model.trainingWheelActive) {
            this.el.querySelector('.nav-menu-item.login a').focus();
            const tutorMenuItem = this.el.querySelector('.tutor-menu-item a');

            if (tutorMenuItem) {
                tutorMenuItem.focus();
            }
        }
    }

    @on('focusin [aria-haspopup="true"]')
    openDropdown() {
        const target = document.activeElement;

        this.selectedIndex = -1;
        this.model.openDropdown = target.href ? target.href.replace(/.*\//, '') : null;
        this.openDropdown = target.parentNode;
        this.update();
    }

    @on('mouseout')
    closeDropdown() {
        if (this.openDropdown) {
            this.model.openDropdown = null;
            this.openDropdown = null;
            this.update();
        }
    }

    @on('click a[data-set-redirect]')
    setRedirect(e) {
        const encodedLocation = encodeURIComponent(window.location.href);

        e.target.href += `?next=${encodedLocation}`;
    }

    @on('click .training-wheel .put-away')
    @on('click .training-wheel button')
    putAwayTrainingWheel() {
        this.model.trainingWheelActive = false;
        this.update();
    }

    @on('keydown a[role="menuitem"][aria-haspopup="true"]')
    @on('keydown .dropdown-menu a[role="menuitem"]')
    moveSelection(event) {
        /* eslint complexity: 0 */
        const target = event.target;
        const menu = target.hasAttribute('aria-haspopup') ?
            target.nextSibling.children : target.parentNode.parentNode.children;
        const lastIndex = menu.length - 1;
        const newTarget = () => {
            if (this.selectedIndex < 0 && !target.hasAttribute('aria-haspopup')) {
                return target.parentNode.parentNode.previousSibling;
            }
            return menu[this.selectedIndex] ? menu[this.selectedIndex].querySelector('a') : null;
        };

        switch (event.keyCode) {
        case $.key.down:
            if (this.selectedIndex < lastIndex) {
                ++this.selectedIndex;
            }
            event.preventDefault();
            this.update();
            newTarget().focus();
            break;
        case $.key.up:
            --this.selectedIndex;
            if (this.selectedIndex < 0) {
                this.selectedIndex = -1;
            }
            event.preventDefault();
            this.update();
            newTarget().focus();
            break;
        case $.key.enter:
        case $.key.space:
            if (newTarget()) {
                event.preventDefault();
                newTarget().dispatchEvent($.newEvent('click'));
            } else {
                // ordinary event handling
                break;
            }
            // Falls through!
        case $.key.esc:
            document.activeElement.blur();
            break;
        default:
            break;
        }
    }

}

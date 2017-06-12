import {Controller} from 'superb';
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

        this.resetSelection = (event) => {
            const target = event.target;
            const isDropdownItem = target.parentNode.parentNode.classList.contains('dropdown-menu');

            if (!isDropdownItem) {
                this.selectedIndex = -1;
                if (target.href && this.el.contains(target)) {
                    this.model.openDropdown = target.href.replace(/.*\//, '');
                } else {
                    this.model.openDropdown = null;
                }
                this.update();
            }
        };

        document.addEventListener('focusin', this.resetSelection);
    }

    onClose() {
        document.removeEventListener('focusin', this.resetSelection);
    }

    onLoaded() {
        this.model.initialRenderDone = true;
    }

    showTutorTrainingWheel() {
        this.model.trainingWheelActive = true;
        this.update();
        this.el.querySelector('.nav-menu-item.login a').focus();
        this.el.querySelector('.tutor-menu-item a').focus();
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
            return menu[this.selectedIndex].querySelector('a');
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
            event.preventDefault();
            newTarget().dispatchEvent($.newEvent('click'));
            // Falls through!
        case $.key.esc:
            document.activeElement.blur();
            break;
        default:
            break;
        }
    }

}

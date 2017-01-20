import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './main-menu.html';

export default class MainMenu extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['container']
        };
        this.css = '/app/components/shell/header/main-menu/main-menu.css';
        this.model = model;
    }

    onLoaded() {
        this.model.initialRenderDone = true;
    }

    @on('click a[data-set-redirect]')
    setRedirect(e) {
        const encodedLocation = encodeURIComponent(window.location.href);

        e.target.href += `?next=${encodedLocation}`;
    }

}

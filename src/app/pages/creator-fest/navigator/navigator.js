import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './navigator.html';
import css from './navigator.css';
import {on} from '~/helpers/controller/decorators';
import routerBus from '~/helpers/router-bus';

const basePath = '/creator-fest';
const spec = {
    template,
    css,
    view: {
        classes: ['boxed', 'navigator-container']
    },
    model() {
        return {
            navLinks: this.navLinks,
            currentClass: (url) =>
                window.location.pathname === `${basePath}/${url}` ?
                    'current' : ''
        };
    }
};

export default class extends componentType(spec) {

    @on('click a')
    showLinkInDialog(event) {
        const target = event.delegateTarget;
        const url = target.getAttribute('href');
        const path = url === 'home' ? basePath : `${basePath}/${url}`;
        const yTarget = history.state.y;

        event.preventDefault();
        routerBus.emit('navigate', path, {
            path: basePath
        });
        window.scrollTo(0, yTarget);
        this.update();
    }

}

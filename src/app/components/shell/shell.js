import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './shell.hbs';

@props({
    el: 'body',
    template: template,
    regions: {
        main: '#main',
        header: '#header',
        footer: '#footer'
    }
})
class AppView extends BaseView {

    initialize() {
        let view = this;

        this.el.innerHTML = this.getTemplate();

        System.import('~/components/shell/header/header').then((m) => {
            let Header = m.default;

            view.regions.header.show(new Header());
        });

        System.import('~/components/shell/footer/footer').then((m) => {
            let Footer = m.default;

            view.regions.footer.show(new Footer());
        });
    }

    render(pageName, options) {
        let view = this;

        // Lazy-load the page
        System.import(`~/pages/${pageName}/${pageName}`).then((m) => {
            let Page = m.default;

            view.regions.main.show(new Page(options));
        });

        return this;
    }
}

let appView = new AppView();

export default appView;

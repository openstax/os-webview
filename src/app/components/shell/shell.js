import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import header from './header/header';
import footer from './footer/footer';
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

    constructor() {
        super();

        this.header = header;
        this.footer = footer;

        this.render();
    }

    onRender() {
        this.regions.header.show(header);
        this.regions.footer.show(footer);
    }

    load(pageName, options) {
        let view = this,
            headTitle = document.querySelector('head title');

        // Lazy-load the page
        System.import(`~/pages/${pageName}/${pageName}`).then((m) => {
            let Page = m.default;

            view.regions.main.show(new Page(options));
            headTitle.textContent = `${pageName[0].toUpperCase()}${pageName.slice(1)} - OpenStax`;
        });

        return this;
    }
}

let appView = new AppView();

export default appView;

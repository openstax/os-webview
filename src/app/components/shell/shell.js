import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import header from './header/header';
import footer from './footer/footer';
import {template} from './shell.hbs';
import zendesk from '~/helpers/zendesk';

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

    load(pageName, options) {
        let view = this,
            headTitle = document.querySelector('head title');

        // Lazy-load the page
        System.import(`~/pages/${pageName}/${pageName}`).then((m) => {
            let Page = m.default;

            this.regions.header.show(header);
            view.regions.main.show(new Page(options));
            this.regions.footer.show(footer);
            headTitle.textContent = `${pageName[0].toUpperCase()}${pageName.slice(1)} - OpenStax`;
            zendesk();
            window.scrollTo(0, 0);
        });

        return this;
    }
}

let appView = new AppView();

export default appView;

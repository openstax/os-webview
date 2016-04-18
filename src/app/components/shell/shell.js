import BaseView from '~/helpers/backbone/view';
import $ from '~/helpers/$';
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
        let headTitle = document.querySelector('head title');

        // Lazy-load the page
        System.import(`~/pages/${pageName}/${pageName}`).then((m) => {
            let Page = m.default;

            this.regions.header.show(header);
            this.regions.main.show(new Page(options));
            this.regions.footer.show(footer);
            headTitle.textContent = `${pageName[0].toUpperCase()}${pageName.slice(1)} - OpenStax`;
            zendesk();

            let hash = window.location.hash;

            if (hash) {
                let attempts = 0,
                    i = setInterval(() => {
                        let destination = document.getElementById(hash.substr(1));

                        if (destination) {
                            $.scrollTo(destination);
                        }
                        ++attempts;
                        if (attempts > 6) {
                            clearInterval(i);
                        }
                    }, 200);
            } else {
                window.scrollTo(0, 0);
            }
            // This seems to fix a rendering problem in IE11
            if ($.isIE11()) {
                setTimeout(() => {
                    let reflow = window.getComputedStyle(header.el).height;

                    // Meaningless parameter, just so variable is used
                    header.render(reflow);
                }, 1000);
            }
        });

        return this;
    }
}

let appView = new AppView();

export default appView;

import {Controller} from 'superb';
import header from './header/header';
import footer from './footer/footer';
// import {initialize, injectButtons} from 'recordo';
import {render as template} from './shell.html';

class Shell extends Controller {

    init() {
        this.el = 'body';
        this.template = template;
        this.regions = {
            header: '#header',
            main: '#main',
            footer: '#footer'
        };

        this.header = header;
        this.footer = footer;
        // Wait for main to receive some content before attaching header and footer
        this.mainObserver = new MutationObserver((observations) => {
            // If the page doesn't use the page loader, prevent the page
            // loader from running later by adding the page-loaded class
            if (!document.body.classList.contains('page-loading')) {
                document.body.classList.add('page-loaded');
            }
            this.regions.header.attach(header);
            this.regions.footer.attach(footer);
            this.mainObserver.disconnect();
        });
    }

    onLoaded() {
        this.mainObserver.observe(document.getElementById('main'), {childList: true});

        // Start recordo
        // initialize({ignoreAjaxResponse: true});
        // if (/collect=true/.test(window.location.search)) {
        //     injectButtons();
        // }
    }

    showLoader() {
        document.body.classList.add('no-scroll');
        document.body.classList.add('page-loading');
    }

    hideLoader() {
        document.body.classList.add('page-loaded');
        document.body.classList.remove('no-scroll');
    }

}

const shell = new Shell();

export default shell;

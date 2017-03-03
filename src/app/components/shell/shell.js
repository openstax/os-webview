import {Controller} from 'superb';
import header from './header/header';
import footer from './footer/footer';
import {initialize, injectButtons} from 'recordo';
import {description as template} from './shell.html';

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
    }

    onLoaded() {
        // Prevents header and footer flashing
        setTimeout(() => {
            this.regions.header.attach(header);
            this.regions.footer.attach(footer);
        }, 200);

        // Start recordo
        initialize({ignoreAjaxResponse: true});
        if (/collect=true/.test(window.location.search)) {
            injectButtons();
        }
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

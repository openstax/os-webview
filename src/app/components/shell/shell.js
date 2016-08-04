import {Controller} from 'superb';
import header from './header/header';
import footer from './footer/footer';
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
        this.regions.header.attach(header);
        this.regions.footer.attach(footer);

        // FIX: Update pages title for the new page
        // headTitle.textContent = `${pageName[0].toUpperCase()}${pageName.slice(1)} - OpenStax`;
    }

}

const shell = new Shell();

export default shell;

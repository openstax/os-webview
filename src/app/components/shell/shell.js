import {Controller} from 'superb.js';
import header from './header/header';
import footer from './footer/footer';
import ModalDialog from '../dialog/dialog';
import {initialize, injectButtons} from 'recordo';
import {description as template} from './shell.html';

class Shell extends Controller {

    init() {
        this.el = 'body';
        this.template = template;
        this.regions = {
            header: '#header',
            dialog: '#dialog',
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

    showDialog(title, content) {
        const region = this.regions.dialog;

        this.dialogProps = {
            title,
            contentComponent: content
        };
        if (!this.dialog) {
            this.dialog = new ModalDialog(() => this.dialogProps, {
                closeDialog: () => {
                    region.el.setAttribute('hidden', '');
                    document.body.classList.remove('no-scroll');
                }
            });
            region.attach(this.dialog);
        } else {
            this.dialog.update();
        }
        region.el.removeAttribute('hidden');
        document.body.classList.add('no-scroll');
    }

}

const shell = new Shell();

export default shell;

import {Controller} from 'superb.js';
import header from './header/header';
import footer from './footer/footer';
import ModalDialog, {Dialog} from '../dialog/dialog';
import {description as template} from './shell.html';
import bus from './shell-bus';
import showNoticeIfNeeded from './cookie-notice/cookie-notice';
import {default as showAdoptionsIfNeeded} from './adoption-dialog/adoption-dialog';

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
            document.body.classList.remove('initial-load');
            this.regions.header.attach(header);
            this.regions.footer.attach(footer);
            this.mainObserver.disconnect();
        });

        // An extra layer of indirection is necessary so we can reuse the Dialog
        // and change the getProps function for it
        this.getDialogProps = () => {};
        this.dialogQueue = [];
    }

    onLoaded() {
        this.mainObserver.observe(document.getElementById('main'), {childList: true});

        window.addEventListener('navigate', this.hideDialog.bind(this));
        showNoticeIfNeeded();
        showAdoptionsIfNeeded();
    }

    showLoader() {
        document.body.classList.add('no-scroll');
        document.body.classList.add('page-loading');
    }

    hideLoader() {
        document.body.classList.add('page-loaded');
        document.body.classList.remove('no-scroll');
    }

    enqueueDialog(getProps) {
        this.dialogQueue.push(getProps);
        if (!this.dialogOpen) {
            this.nextDialog();
        }
    }

    nextDialog() {
        if (this.dialogQueue.length > 0) {
            this.showDialog(this.dialogQueue.shift());
        }
    }

    showDialog(getProps) {
        const region = this.regions.dialog;
        const {nonModal} = getProps();

        this.dialogOpen = true;
        this.getDialogProps = getProps;
        if (nonModal) {
            const d = new Dialog({
                getProps: () => this.getDialogProps(),
                handlers: {
                    closeDialog: () => {
                        d.detach();
                        region.el.setAttribute('hidden', '');
                        this.dialogOpen = false;
                        this.nextDialog();
                    }
                }
            });

            region.append(d);
            this.hideNonModal = () => {
                d.closeDialog();
            };
        } else {
            if (!this.dialog) {
                const savedY = window.scrollY;

                this.dialog = new ModalDialog(() => this.getDialogProps(), {
                    closeDialog: () => {
                        region.el.setAttribute('hidden', '');
                        document.body.classList.remove('no-scroll-dialog');
                        this.dialog.hide();
                        this.dialogOpen = false;
                        this.nextDialog();
                        window.scrollTo(0, this.dialog.savedY + 102); // ??? Menu fudge?
                    }
                });
                this.dialog.savedY = savedY;
                region.append(this.dialog);
            } else {
                this.dialog.savedY = window.scrollY;
                this.dialog.update();
            }
            document.body.classList.add('no-scroll-dialog');
        }
        region.el.removeAttribute('hidden');
    }

    hideDialog() {
        if (this.dialog && ! this.regions.dialog.el.hasAttribute('hidden')) {
            this.dialog.closeDialog();
        }
    }

}

const shell = new Shell();
let stickyCount = 0;

bus.on('showLoader', shell.showLoader.bind(shell));
bus.on('hideLoader', shell.hideLoader.bind(shell));

bus.on('with-sticky', () => {
    ++stickyCount;
    shell.regions.main.el.classList.add('with-sticky');
});

bus.on('no-sticky', () => {
    --stickyCount;
    if (stickyCount <= 0) {
        shell.regions.main.el.classList.remove('with-sticky');
    }
});
bus.on('with-modal', () => {
    shell.regions.main.el.classList.add('with-modal');
    document.body.classList.add('no-scroll');
});
bus.on('no-modal', () => {
    shell.regions.main.el.classList.remove('with-modal');
    document.body.classList.remove('no-scroll');
});
bus.on('updateDialog', () => shell.dialog.update());
bus.on('showDialog', shell.enqueueDialog.bind(shell));
bus.on('hideDialog', shell.hideDialog.bind(shell));
bus.on('hideNonModal', () => {
    if (shell.hideNonModal) {
        shell.hideNonModal();
        delete shell.hideNonModal;
    }
});

export default shell;

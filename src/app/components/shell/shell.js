import {Controller} from 'superb.js';
import header from './header/header';
import lowerStickyNote from './lower-sticky-note/lower-sticky-note';
import microsurvey from './microsurvey-popup/microsurvey-popup';
import footer from './footer/footer';
import ModalDialog, {Dialog} from '../dialog/dialog';
import bus from './shell-bus';
import showNoticeIfNeeded from './cookie-notice/cookie-notice';
import '~/helpers/font-awesome';

/*
 * Special behavior: by assigning this.el and an empty update function, this
 * controller inherits the (unchanging) html block. It just manages its regions.
 */
class Shell extends Controller {

    init() {
        this.el = 'body';
        this.regions = {
            header: '#header',
            lowerStickyNote: '#lower-sticky-note',
            microsurvey: '#microsurvey',
            dialog: '#dialog',
            main: '#main',
            footer: '#footer'
        };

        // An extra layer of indirection is necessary so we can reuse the Dialog
        // and change the getProps function for it
        this.getDialogProps = () => {};
        this.dialogQueue = [];
    }

    update() {}

    onLoaded() {
        // Wait for main to receive some content before attaching header and footer
        const mainObserver = new MutationObserver((observations) => {
            document.body.classList.remove('initial-load');
            this.regions.header.attach(header);
            this.regions.lowerStickyNote.attach(lowerStickyNote);
            this.regions.microsurvey.attach(microsurvey);
            this.regions.footer.attach(footer);
            mainObserver.disconnect();
        });

        mainObserver.observe(document.getElementById('main'), {childList: true, subtree: true});
        window.addEventListener('navigate', this.hideDialog.bind(this));
        showNoticeIfNeeded();
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

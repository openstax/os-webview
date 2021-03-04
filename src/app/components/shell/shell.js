import {Controller} from 'superb.js';
import header from './header/header';
import lowerStickyNote from './lower-sticky-note/lower-sticky-note';
import microsurvey from './microsurvey-popup/microsurvey-popup';
import footer from './footer/footer';
import bus from './shell-bus';
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
            main: '#main',
            footer: '#footer'
        };
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

export default shell;

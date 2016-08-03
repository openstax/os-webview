import 'babel-polyfill';
import 'classList';
import 'fetch';
import {initialize, injectButtons} from 'recordo';
import router from '~/router';
import shell from '~/components/shell/shell';


initialize({ignoreAjaxResponse: true});
// HACK: the app destroys the DOM when starting up so we need to restart recordo so it reinjects into the DOM.
// TODO: Should only run the setTimeout if `collect=true` has been specified on the URL
setTimeout(() => {
    injectButtons();
}, 2000);


// NOTE: precaching is disabled. uglify will remove this code block since it's unreachable
if (false && '@ENV@' === 'production' && 'serviceWorker' in navigator) {
    /* eslint no-console: 0 */
    /* eslint no-constant-condition: 0 */ // NOTE: Remove if enabling precaching
    navigator.serviceWorker.register('sw.js').then((registration) => {
        if (typeof registration.update === 'function') {
            registration.update();
        }

        registration.onupdatefound = function () {
            const installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
                switch (installingWorker.state) {
                case 'installed':
                    if (navigator.serviceWorker.controller) {
                        console.log('New or updated content is available.');
                    } else {
                        console.log('Content is now available offline!');
                    }
                    break;
                case 'redundant':
                    console.error('The installing service worker became redundant.');
                    break;
                default:
                    break;
                }
            };
        };
    }).catch((e) => {
        console.error('Error during service worker registration:', e);
    });
}

class App {

    constructor() {
        this.shell = shell;
        router.start();
    }

}

const app = new App();

export default app;

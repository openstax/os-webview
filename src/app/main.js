import 'babel-polyfill';
import 'fetch';
import $ from './helpers/$';
import router from './router';

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
        router.start();

        if (!$.isSupported()) {
            /* eslint no-alert: 0 */
            alert('Our site is designed to work with recent versions of Chrome,' +
            ' Firefox, IE (Edge) and Safari. It may not work in your browser.');
        }
    }

}

const app = new App();

export default app;

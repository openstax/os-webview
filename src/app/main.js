import 'babel-polyfill';
import Backbone from 'backbone';
import linkHelper from '~/helpers/link';
import router from '~/router';
import appView from '~/components/shell/shell';

const EXTERNAL = /^((f|ht)tps?:)?\/\//;

if ('@ENV@' === 'production' && 'serviceWorker' in navigator) {
    /* eslint no-console: 0 */
    navigator.serviceWorker.register('sw.js').then((registration) => {
        if (typeof registration.update === 'function') {
            registration.update();
        }

        registration.onupdatefound = function () {
            let installingWorker = registration.installing;

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
        this.router = router;
        this.view = appView;

        Backbone.history.start({
            hashChange: false,
            pushState: true
        });

        document.addEventListener('click', (e) => {
            let el = linkHelper.validUrlClick(e);

            if (!el) {
                return;
            }

            let href = el.getAttribute('href');

            e.preventDefault();

            if (EXTERNAL.test(href)) {
                window.open(href, '_blank');
            } else {
                router.navigate(href, {
                    trigger: (el.getAttribute('data-trigger') !== false)
                });
            }
        });
    }

}

let app = new App();

export default app;

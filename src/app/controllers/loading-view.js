import {Controller} from 'superb';
import LoadingSection from '~/components/loading-section/loading-section';

// const PARSE_URL = /url\(['"]?([^")]+)/;
// const MINIMUM_WAIT = 2000;

/*
function getImages() {
    const urls = new Set();
    const els = document.getElementsByTagName('img');

    for (const el of Array.from(els)) {
        const url = el.getAttribute('src');

        if (url) {
            urls.add(url);
        }
    }

    return urls;
}

function getBackgroundImages() {
    const urls = new Set();
    const els = document.getElementsByTagName('*');
    const view = document.defaultView || window;

    for (const el of Array.from(els)) {
        if (el) {
            let url = view.getComputedStyle(el).getPropertyValue('background-image');

            url = PARSE_URL.exec(url);

            if (url) {
                urls.add(url[1]);
            }
        }
    }

    return urls;
}
*/

class LoadingView extends Controller {

    constructor(...args) {
        super(...args);
        this.otherPromises = [];
        this.subviewPromises = [];
        this.loadingSection = new LoadingSection();
        this.isLoaded = new Promise((resolve) => {
            this.resolveLoaded = resolve;
        });
    }

    // FIX: Refactor to handle hiding/showing all relevant page elements
    /*
    onRender() {
        document.getElementById('header').classList.remove('hidden');
        document.getElementById('footer').classList.remove('hidden');
        this.loadingSection.remove();
        this.resolveLoaded();
    }

    // FIX: Refactor to handle hiding/showing all relevant page elements
    onLoaded() {
        document.getElementById('header').classList.add('hidden');
        document.getElementById('footer').classList.add('hidden');
        this.regions.self.el = this.el;
        this.regions.self.append(this.loadingSection);
        this.renderStart = Date.now();
    }

    onAfterRender() {
        Promise.all(this.subviewPromises).then(() => {
            this.trackResourceLoading();
        });
    }

    trackResourceLoading() {
        const imgs = getImages();
        const bgImages = getBackgroundImages();
        const urls = new Set([...imgs, ...bgImages]);
        const imagesLoaded = [...urls].map((url) => {
            const img = document.createElement('img');

            img.setAttribute('src', url);

            return new Promise((resolve) => {
                img.onload = resolve;
            });
        });

        const videos = new Set([...document.getElementsByTagName('video')]);
        const videosLoaded = [...videos].map((video) => {
            const tracker = new Promise((resolve) => {
                video.oncanplaythrough = resolve;
            });

            return tracker;
        });

        return Promise.all([...imagesLoaded, ...videosLoaded, ...this.otherPromises]).then(() => {
            const elapsed = Date.now() - this.renderStart;

            setTimeout(() => this.onLoaded(), elapsed > MINIMUM_WAIT ? 0 : MINIMUM_WAIT - elapsed);
        });
    }
    */

}

export default LoadingView;

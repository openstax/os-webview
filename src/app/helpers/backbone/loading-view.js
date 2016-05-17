import BaseView from './view';
import LoadingSection from '~/components/loading-section/loading-section';

const PARSE_URL = /url\(['"]?([^")]+)/;
const MINIMUM_WAIT = 2000;

function getImages() {
    let urls = new Set();
    let els = document.getElementsByTagName('img');

    for (let el of Array.from(els)) {
        let url = el.getAttribute('src');

        if (url) {
            urls.add(url);
        }
    }

    return urls;
}

function getBackgroundImages() {
    let urls = new Set();
    let els = document.getElementsByTagName('*');
    let view = document.defaultView || window;

    for (let el of Array.from(els)) {
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

class LoadingView extends BaseView {

    constructor() {
        super();
        this.otherPromises = [];
        this.subviewPromises = [];
        this.loadingSection = new LoadingSection();
        this.isLoaded = new Promise((resolve) => {
            this.resolveLoaded = resolve;
        });
    }

    onLoaded() {
        document.getElementById('header').classList.remove('hidden');
        document.getElementById('footer').classList.remove('hidden');
        this.loadingSection.remove();
        this.resolveLoaded();
    }

    onRender() {
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
        let imgs = getImages();
        let bgImages = getBackgroundImages();
        let urls = new Set([...imgs, ...bgImages]);
        let imagesLoaded = [...urls].map((url) => {
            let img = document.createElement('img');

            img.setAttribute('src', url);

            return new Promise((resolve) => {
                img.onload = resolve;
            });
        });

        let videos = new Set([...document.getElementsByTagName('video')]);
        let videosLoaded = [...videos].map((video) => {
            let tracker = new Promise((resolve) => {
                video.oncanplaythrough = resolve;
            });

            return tracker;
        });

        return Promise.all([...imagesLoaded, ...videosLoaded, ...this.otherPromises]).then(() => {
            let elapsed = Date.now() - this.renderStart;

            setTimeout(() => this.onLoaded(), elapsed > MINIMUM_WAIT ? 0 : MINIMUM_WAIT - elapsed);
        });
    }

}

export default LoadingView;

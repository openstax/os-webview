import BaseView from './view';

const PARSE_URL = /url\(['"]?([^")]+)/;

function getImages() {
    let urls = new Set();
    let els = document.getElementsByTagName('img');

    for (let el of els) {
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

    for (let el of els) {
        if (el && el.style) {
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

    onLoaded() {} // noop

    onAfterRender() {
        this.trackResourceLoading();
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

        return Promise.all([...imagesLoaded, ...videosLoaded]).then(() => {
            this.onLoaded();
        });
    }

}

export default LoadingView;

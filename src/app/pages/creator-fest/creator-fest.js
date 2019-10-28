import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './creator-fest.html';
import css from './creator-fest.css';
import Navigator from './navigator/navigator';
import Banner from './banner/banner';
import HomeContent from './home-content/home-content';
import FetchedContent from './fetched-content/fetched-content';
import shellBus from '~/components/shell/shell-bus';
import settings from 'settings';

const spec = {
    template,
    css,
    view: {
        classes: ['creator-fest', 'page'],
        tag: 'main' // if the HTML doesn't contain a main tag
    },
    regions: {
        banner: '#banner',
        navigator: '#navigator',
        pageContent: '#page-content'
    },
    slug: 'pages/creator-fest'
};

export default class extends componentType(spec) {

    onDataLoaded() {
        shellBus.emit('with-sticky');
        const data = this.pageData;
        const navLinks = data.navigator[0].map((nData) => ({
            url: nData.text.toLowerCase(),
            text: nData.text,
            fetchUrl: `${settings.apiOrigin}${settings.apiPrefix}/${nData.slug.replace('general', 'spike')}`
        }));
        const banner = new Banner({
            el: this.regions.banner.el,
            model: {
                headline: data.banner_headline,
                content: data.banner_content,
                background: data.banner_image.meta.download_url
            }
        });
        const navigator = new Navigator({
            el: this.regions.navigator.el,
            navLinks
        });

        this.setContentFromLocation = () => {
            const path = window.location.pathname;
            const linkEntry = navLinks.find((obj) => `/creator-fest/${obj.url}` === path);
            const content = linkEntry ?
                new FetchedContent({pageId: linkEntry.url, url: linkEntry.fetchUrl}) :
                new HomeContent({data});

            this.regions.pageContent.attach(content);
        };
        window.addEventListener('navigate', this.setContentFromLocation);
        this.setContentFromLocation();
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        window.removeEventListener('navigate', this.setContentFromLocation);
        shellBus.emit('no-sticky');
    }

}

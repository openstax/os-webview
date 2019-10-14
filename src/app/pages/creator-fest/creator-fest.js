import componentType from '~/helpers/controller/init-mixin';
import css from './creator-fest.css';
import Banner from './banner/banner';
import About from './about/about';
import Why from './why/why';
import settings from 'settings';

const spec = {
    css,
    view: {
        classes: ['creator-fest', 'page'],
        tag: 'main' // if the HTML doesn't contain a main tag
    },
    slug: 'pages/creator-fest'
};

export default class extends componentType(spec) {

    onDataLoaded() {
        const data = this.pageData;
        const navLinks = data.navigator[0].map((nData) => ({
            url: `${settings.apiOrigin}${settings.apiPrefix}/${nData.slug.replace('general', 'spike')}`,
            text: nData.text
        }));
        const rData = data.register[0][0];
        const registerBox = {
            headline: rData.headline,
            address: rData.address,
            url: rData.button_url,
            text: rData.button_text
        };

        this.regions.self.attach(new Banner({
            model: {
                headline: data.banner_headline,
                content: data.banner_content,
                background: data.banner_image.meta.download_url
            }
        }));
        data.page_panels.forEach((pData, i) => {
            const model = {
                superheadline: pData.superheading,
                headline: pData.heading,
                htmlBlock: pData.embed,
                cards: pData.cards,
                description: pData.paragraph,
                background: pData.background_image.image
            };
            let SectionConstructor = Why;

            if (i === 0) {
                Object.assign(model, {navLinks, registerBox});
                SectionConstructor = About;
            }
            this.regions.self.append(new SectionConstructor({model}));
        });
    }

}

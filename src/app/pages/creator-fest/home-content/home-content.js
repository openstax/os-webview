import componentType from '~/helpers/controller/init-mixin';
import css from './home-content.css';
import About from './about/about';
import Why from './why/why';

const spec = {
    css,
    view: {
        classes: ['home']
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        const rData = this.data.register[0][0];
        const registerBox = {
            headline: rData.headline,
            address: rData.address,
            url: rData.button_url,
            text: rData.button_text
        };

        this.data.page_panels.forEach((pData, i) => {
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
                Object.assign(model, {registerBox});
                SectionConstructor = About;
            }
            this.regions.self.append(new SectionConstructor({model}));
        });
    }

}

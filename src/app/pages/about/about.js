import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import {description as template} from './about.html';
import css from './about.css';

const spec = {
    template,
    css,
    view: {
        classes: ['about', 'page'],
        tag: 'main'
    },
    slug: 'pages/about',
    model() {
        const data = this.pageData;
        const translateCard = (c) => {
            const imgEntry = c.find((v) => v.type === 'image');
            const textEntry = c.find((v) => v.type === 'paragraph');

            return {
                image: imgEntry.value.image,
                text: textEntry.value,
                link: imgEntry.value.link
            };
        };

        return data && {
            whoHeadline: data.who_heading,
            whoBlurb: data.who_paragraph,
            whoImage: data.who_image_url,
            whatHeadline: data.what_heading,
            whatBlurb: data.what_paragraph,
            cards: (data.what_cards || []).map(translateCard),
            whereHeadline: data.where_heading,
            whereBlurb: data.where_paragraph,
            map: data.where_map_url,
            mapAlt: data.where_map_alt || 'animated map suggesting where our books are being adopted'
        };
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class AboutNew extends BaseClass {

    onDataLoaded() {
        this.update();
        this.insertHtml();
    }

}

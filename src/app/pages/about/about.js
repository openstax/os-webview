import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {description as template} from './about.html';

export default class AboutNew extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['about', 'page'],
            tag: 'main'
        };
        this.css = `/app/pages/about/about.css?${VERSION}`;
        this.slug = 'pages/about';

        this.model = () => this.getModel();
    }

    getModel() {
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
            map: data.where_map_url
        };
    }

    onDataLoaded() {
        this.update();
        $.insertHtml(this.el, this.model);
    }

}

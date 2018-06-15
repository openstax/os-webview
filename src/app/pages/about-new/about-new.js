import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {description as template} from './about-new.html';

export default class AboutNew extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['about-new', 'page']
        };
        this.css = `/app/pages/about-new/about-new.css?${VERSION}`;
        this.slug = 'pages/about-new';

        this.model = () => this.getModel();
    }

    getModel() {
        const data = this.pageData || {};

        return {
            whoHeadline: data.who_headline,
            whoBlurb: data.who_blurb,
            whoImage: data.who_image,
            whatHeadline: data.what_headline,
            whatBlurb: data.what_blurb,
            cards: data.what_cards,
            whereHeadline: data.where_headline,
            whereBlurb: data.where_blurb,
            map: data.map
        };
    }

    onLoaded() {
        const lorem = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur auctor porttitor
        neque ut auctor. Nunc a dui sit amet est ullamcorper dapibus. Aliquam nec finibus
        velit. Aenean id ligula a turpis pulvinar commodo. Vivamus cursus suscipit mauris
        sodales congue.
        <p>
        <b>Pellentesque</b> habitant morbi tristique senectus et netus et malesuada fames ac turpis
        egestas. Curabitur vulputate ultricies enim, sit amet pellentesque mauris. In sodales
        mi ac nisl tempus posuere.
        `;
        this.pageData = {
            who_headline: 'Who we are',
            who_blurb: lorem,
            who_image: 'http://via.placeholder.com/800x600',
            what_headline: 'What we do',
            what_blurb: lorem.substr(0, 150),
            what_cards: [1,2,3,4].map(() => ({
                image: 'http://via.placeholder.com/275x160',
                text: lorem.substr(0, 100)
            })),
            where_headline: 'Where we\'re going',
            where_blurb: lorem,
            map: 'http://via.placeholder.com/1100x800'
        };
        this.onDataLoaded();
    }

    onDataLoaded() {
        this.update();
        $.insertHtml(this.el, this.model);
    }

}

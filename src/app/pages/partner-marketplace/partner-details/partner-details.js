import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './partner-details.html';
import css from './partner-details.css';
import Carousel from './carousel/carousel';
import {on} from '~/helpers/controller/decorators';
import analyticsEvents from '../analytics-events';

const spec = {
    template,
    css,
    view: {
        classes: ['partner-details']
    },
    regions: {
        carousel: '.carousel'
    },
    model() {
        return {
            icon: this.logoUrl || 'https://via.placeholder.com/150x150?text=[no%20logo]',
            headline: this.title,
            blurb: this.blurb,
            titles: this.books, // TODO: lookup proper titles from Salesforce names
            tags: this.tags,
            infoUrl: 'http://dontgohere.com',
            infoText: 'Request info',
            description: this.richDescription,
            partnerUrl: this.website
        };
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.regions.carousel.attach(new Carousel({
            images: this.images,
            videos: this.videos
        }));
    }

    @on('click .btn.primary')
    sendRequestInfoEvent() {
        analyticsEvents.requestInfo(this.title);
    }

    @on('click .partner-website')
    sendPartnerWebsiteEvent(event) {
        analyticsEvents.partnerWebsite(event.target.href);
    }

}

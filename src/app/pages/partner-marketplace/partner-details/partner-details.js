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
            icon: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/TopHat_Lockup_FullColor_RGB.original.jpg',
            headline: this.title,
            blurb: 'Lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit.',
            titles: ['Science', 'Lorem', 'Ipsum'],
            tags: ['tag 1', 'tag 2', 'tag 3'],
            infoUrl: 'http://dontgohere.com',
            infoText: 'Request info',
            description: `
            <h3>Overview</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Id
            venenatis a condimentum vitae sapien pellentesque. Morbi tristique
            senectus et netus et malesuada fames ac. Id ornare arcu odio ut sem
            nulla. Ut enim blandit volutpat maecenas volutpat blandit aliquam
            etiam. At quis risus sed vulputate odio. Massa eget egestas purus
            viverra accumsan in nisl.</p>
            <p>Ultrices eros in cursus turpis massa
            tincidunt dui ut. Ultricies lacus sed turpis tincidunt. Pellentesque
            habitant morbi tristique senectus. Non nisi est sit amet facilisis.
            Elit scelerisque mauris pellentesque pulvinar pellentesque. Morbi
            tincidunt augue interdum velit euismod in pellentesque massa. Purus
            in mollis nunc sed id semper. Non enim praesent elementum facilisis
            leo. Fermentum dui faucibus in ornare.</p>
            `,
            partnerUrl: 'http://webassign.com'
        };
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    onLoaded() {
        this.regions.carousel.attach(new Carousel());
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

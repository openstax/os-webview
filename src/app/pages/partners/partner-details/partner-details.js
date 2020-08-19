import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './partner-details.html';
import css from './partner-details.css';
import Carousel from './carousel/carousel';
import {on} from '~/helpers/controller/decorators';
import analyticsEvents from '../analytics-events';
import shellBus from '~/components/shell/shell-bus';
import booksPromise from '~/models/books';

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
            titles: this.books,
            tags: this.tags,
            infoUrl: this.infoUrl,
            infoText: this.infoLinkText,
            description: this.richDescription,
            partnerUrl: this.website || this.partner_website,
            partnerLinkText: this.websiteLinkText,
            verifiedFeatures: this.verifiedFeatures,
            badgeImage: '/images/partners/verified-badge.svg'
        };
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.regions.carousel.attach(new Carousel({
            icon: this.logoUrl,
            images: this.images,
            videos: this.videos
        }));
        // Replace Salesforce abbreviations with book names
        booksPromise.then((results) => {
            const abbrevs = this.books;

            this.books = abbrevs
                .map((a) => results.find((b) => b.salesforce_abbreviation === a) || a)
                .filter((b) => {
                    const found = typeof b === 'object';

                    if (!found) {
                        console.warn('Book not found:', b);
                    }
                    return found;
                })
                .map((b) => b.salesforce_name);
            this.update();
        });
    }

    onAttached() {
        if (super.onAttached) {
            super.onAttached();
        }
        const scrollingRegion = this.el.parentNode;
        const scrollCallback = (event) => {
            analyticsEvents.lightboxScroll(this.title);
            this.removeScrollListener();
            delete this.removeScrollListener;
        };

        scrollingRegion.addEventListener('scroll', scrollCallback);
        this.removeScrollListener = () => scrollingRegion.removeEventListener('scroll', scrollCallback);
    }

    onClose() {
        if (this.removeScrollListener) {
            this.removeScrollListener();
        }
    }

    @on('click .btn.primary')
    sendRequestInfoEvent() {
        analyticsEvents.requestInfo(this.title);
        shellBus.emit('hideDialog');
    }

    @on('click .partner-website')
    sendPartnerWebsiteEvent(event) {
        analyticsEvents.partnerWebsite(event.target.href);
    }

}

import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import HeadlinePaginator from '~/components/headline-paginator/headline-paginator';
import MoreFewer from '~/components/more-fewer/more-fewer';
import PressExcerpt from './press-excerpt/press-excerpt';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './press.html';

export default class Press extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['press', 'page']
        };
        this.css = `/app/pages/press/press.css?${VERSION}`;
        this.regions = {
            pressReleases: '.press-releases',
            newsMentions: '.news-mentions'
        };
        this.slug = 'pages/press';
        this.model = () => this.getModel();
        this.heading = '';
        this.componentMessage = 'Loading';
        this.buildComponents();
    }

    buildComponents() {
        const excerpt = new PressExcerpt(() => ({
            author: 'David Ruth',
            org: 'Rice News',
            date: 'January 23, 2018',
            headline: 'Principled partnerships for sustainable OER',
            excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
                'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
                'aliqua. Ut enim ad minim veniam, quis nostrud exetam'
        }));
        const prPaginator = new HeadlinePaginator(() => ({
            content: excerpt
        }));
        this.moreFewer = new MoreFewer(() => ({
            moreContent: new PressExcerpt(() => ({
                author: 'David Ruth',
                org: 'Rice News',
                date: 'January 23, 2018',
                headline: 'Principled partnerships for sustainable OER',
            })),
            fewerContent: prPaginator,
            items: 'press releases'
        }));
        this.nmPaginator = new HeadlinePaginator(() => ({
            content: new PressExcerpt(() => ({
                iconUrl: 'http://via.placeholder.com/50x50',
                author: 'David Ruth',
                org: 'Rice News',
                date: 'January 23, 2018',
                headline: 'Principled partnerships for sustainable OER',
                externalLink: 'https://www.lipsum.com/'
            }))
        }));
    }

    onLoaded() {
        this.regions.pressReleases.append(this.moreFewer);
        this.regions.newsMentions.append(this.nmPaginator);
    }

    getModel() {
        return {
            heading: this.heading
        };
    }

}

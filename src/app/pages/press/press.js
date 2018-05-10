import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import Booking from './booking/booking';
import HeadlinePaginator from '~/components/headline-paginator/headline-paginator';
import MobileSelector from './mobile-selector/mobile-selector';
import MoreFewer from '~/components/more-fewer/more-fewer';
import PressExcerpt from './press-excerpt/press-excerpt';
import PressMobile from './press-mobile/press-mobile';
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
            mobileSelector: '.mobile-selector',
            mobileView: '.mobile-view',
            pressReleases: '.press-releases',
            newsMentions: '.news-mentions'
        };
        this.slug = 'pages/press';
        this.model = () => this.getModel();
        this.heading = '';
        this.mobileSelection = 'Press releases';
    }

    buildComponents() {
        const model = this.getModel();
        const twoExcerpts = model.pressReleases.slice(0, 2).map((r) => new PressExcerpt(() => r));
        const noExcerpts = model.pressReleases.map((r) => {
            const result = Object.assign({}, r);

            delete result.excerpt;
            return new PressExcerpt(() => result);
        });
        const prPaginator = new HeadlinePaginator(() => ({contents: noExcerpts}));

        this.mobileView = new PressMobile(() => ({
            pageData: model,
            mobileSelection: this.mobileSelection
        }));
        this.mobileSelector = new MobileSelector(
            () => ({
                selectedValue: this.mobileSelection,
                values: [
                    'Press releases',
                    'News mentions',
                    'Press inquiries',
                    'Booking'
                ]
            }),
            (newValue) => {
                this.mobileSelection = newValue;
                this.mobileView.update();
            }
        );
        this.moreFewer = new MoreFewer(() => ({
            fewerContents: twoExcerpts,
            moreContents: prPaginator,
            items: 'press releases'
        }));
        this.nmPaginator = new HeadlinePaginator(() => ({
            contents: model.newsMentions.map((m) => new PressExcerpt(() => m))
        }));
    }

    onLoaded() {
        this.pageData = {
            headline: 'In the news',
            pressReleases: [
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'March 8, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'March 7, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'March 6, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'March 5, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'March 4, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'March 3, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'March 2, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'March 1, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'February 28, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                },
                {
                    author: 'David Ruth',
                    org: 'Rice News',
                    date: 'February 27, 2018',
                    headline: 'Principled partnerships for sustainable OER',
                    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exer`,
                    url: 'https://openstax.org/blog/news/principled-partnerships-sustainable-oer'
                }

            ],
            newsMentions: [
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                },
                {
                    iconUrl: 'http://via.placeholder.com/50x50',
                    source: 'Washington Post',
                    date: 'March 4, 2018',
                    headline: 'Making learning meaningful by connecting it to real life',
                    url: 'http://voices.washingtonpost.com/answer-sheet/learning/why-fun-matters-in-education.html'
                }
            ],
            missionStatements: [
                `<b>To increase access to education</b> by providing effective
                educational materials for free, or at minimal cost.`,
                `<b>To partner with educators to help</b> meet the needs of their students.`,
                `<b>To leverage our freedom as a non-profit</b> to make learning outcomes
                &mdash; not financial outcomes &mdash; our metric for success.`
            ],
            pressInquiries: {
                name: 'Con Tact',
                phone: '713-348-2975',
                email: 'media@openstax.org'
            },
            pressKitUrl: 'http://www.google.com',
            experts: {
                headline: 'Book our experts',
                blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.`,
                bios: [
                    {
                        imageUrl: 'http://via.placeholder.com/99x125',
                        name: 'Daniel Williamson',
                        title: 'Managing Director',
                        contact: '@twitter, @linkedin, xxxxx@rice.edu',
                        bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna`
                    },
                    {
                        imageUrl: 'http://via.placeholder.com/99x125',
                        name: 'Richard Baraniuk',
                        title: 'Director',
                        contact: 'xxxx@rice.edu',
                        bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna`
                    },
                    {
                        imageUrl: 'http://via.placeholder.com/99x125',
                        name: 'Nicole Finkbeiner',
                        title: 'Associate Director, Institutional Relations',
                        contact: 'xxxxx@rice.edu',
                        bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna`
                    }
                ]
            }
        };
        this.update();
        this.onDataLoaded();
    }

    onDataLoaded() {
        const Region = this.regions.self.constructor;
        const bookingsEl = this.el.querySelector('[data-region="bookings"]');
        const bookingsRegion = new Region(bookingsEl, this);

        $.insertHtml(this.el, this.model);
        this.buildComponents();
        this.regions.mobileSelector.attach(this.mobileSelector);
        this.regions.mobileView.attach(this.mobileView);
        this.regions.pressReleases.append(this.moreFewer);
        this.regions.newsMentions.append(this.nmPaginator);
        this.model().experts.bios.forEach((obj) => bookingsRegion.append(new Booking(obj)));
    }

    getModel() {
        return this.pageData || {};
    }

}

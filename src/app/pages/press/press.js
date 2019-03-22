import Article from './article/article';
import Bookings from './bookings/bookings';
import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import HeadlinePaginator from '~/components/headline-paginator/headline-paginator';
import Inquiries from './inquiries/inquiries';
import MobileSelector from './mobile-selector/mobile-selector';
import MoreFewer from '~/components/more-fewer/more-fewer';
import PressExcerpt from './press-excerpt/press-excerpt';
import PressMobile from './press-mobile/press-mobile';
import {description as template} from './press.html';
import {description as articleTemplate} from './press-article.html';
import css from './press.css';

const spec = {
    template,
    css,
    view: {
        classes: ['press', 'page']
    },
    regions: {
        article: '.article',
        mobileSelector: '[data-region="mobile-selector"]',
        mobileView: '.mobile-view',
        pressReleases: '.press-releases',
        newsMentions: '.news-mentions',
        pressInquiries: '.press-inquiries',
        bookings: '.book-experts'
    },
    slug: 'press',
    model() {
        const model = this.pageData ?
            {
                headline: this.pageData.title,
                missionStatements: this.pageData.mission_statements
                    .map((obj) => obj.statement),
                showArticle: Boolean(this.articleSlug)
            } :
            {};

        return model;
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class Press extends BaseClass {

    init() {
        super.init();
        this.articleSlug = this.getArticleSlug();
        if (this.articleSlug) {
            this.template = articleTemplate;
        }
        this.heading = '';
        this.mobileSelection = 'Press releases';
    }

    getArticleSlug() {
        const slugMatch = window.location.pathname.match(/\/(press\/.+)/);

        return slugMatch ? slugMatch[1] : null;
    }

    buildComponents(submodels) {
        const twoExcerpts = submodels.pressReleases.slice(0, 2).map((r) => new PressExcerpt(() => r));
        const noExcerpts = submodels.pressReleases.map((r) => {
            const result = Object.assign({}, r);

            delete result.excerpt;
            return new PressExcerpt(() => result);
        });
        const prPaginator = new HeadlinePaginator(() => ({contents: noExcerpts}));

        this.mobileView = new PressMobile(() => ({
            pageData: submodels,
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
            contents: submodels.newsMentions.map((m) => new PressExcerpt(() => m))
        }));
    }

    onDataLoaded() {
        this.update();
        this.insertHtml();
        const asDate = (dateStr) => {
            const [year, month, day] = dateStr.split('-');

            return new Date(year, month - 1, day);
        };
        const convertedDate = (dateStr) => {
            const d = (asDate(dateStr)).toString().split(' ');

            return `${d[1]} ${d[2]}, ${d[3]}`;
        };

        this.articleSlugs = {};
        const submodels = {
            pressReleases: Reflect.ownKeys(this.pageData.releases)
                .filter((k) => k !== this.articleSlug)
                .map((k) => {
                    const release = this.pageData.releases[k];
                    const url = `/${k}`;

                    this.articleSlugs[url] = release.detail_url.replace(/.*\/api\//, '/');
                    return {
                        author: release.author,
                        date: convertedDate(release.date),
                        asDate: asDate(release.date),
                        url,
                        headline: release.heading,
                        excerpt: release.excerpt
                    };
                })
                .sort((a, b) => b.asDate.getTime() - a.asDate.getTime()),
            missionStatements: this.pageData.mission_statements
                .map((obj) => obj.statement),
            pressInquiries: {
                name: this.pageData.press_inquiry_name,
                phone: this.pageData.press_inquiry_phone,
                email: this.pageData.press_inquiry_email
            },
            pressKitUrl: this.pageData.press_kit_url,
            experts: {
                headline: 'Book our experts',
                blurb: this.pageData.experts_blurb,
                bios: this.pageData.experts_bios
                    .map((b) => ({
                        imageUrl: b.expert_image,
                        name: b.name,
                        title: b.title,
                        contact: b.email,
                        bio: b.bio
                    }))
            },
            newsMentions: this.pageData.mentions
                .map((obj) => ({
                    iconUrl: obj.source.logo,
                    source: obj.source.name,
                    date: convertedDate(obj.date),
                    asDate: asDate(obj.date),
                    headline: obj.headline,
                    url: obj.url
                }))
                .sort((a, b) => b.asDate.getTime() - a.asDate.getTime())
        };

        this.buildComponents(submodels);
        if (this.articleSlug) {
            this.regions.article.append(new Article(this.articleSlug));
            if (submodels.pressReleases.length > 0) {
                this.regions.pressReleases.append(this.moreFewer);
            }
        } else {
            this.regions.pressInquiries.attach(new Inquiries({
                pressInquiries: submodels.pressInquiries,
                pressKitUrl: submodels.pressKitUrl
            }));
            this.regions.mobileSelector.attach(this.mobileSelector);
            this.regions.mobileView.attach(this.mobileView);
            this.regions.pressReleases.append(this.moreFewer);
            this.regions.newsMentions.append(this.nmPaginator);
            this.regions.bookings.attach(new Bookings(submodels.experts));
        }
    }

}

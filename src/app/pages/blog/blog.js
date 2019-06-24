import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import settings from 'settings';
import {on} from '~/helpers/controller/decorators';
import routerBus from '~/helpers/router-bus';
import analytics from '~/helpers/analytics';
import css from './blog.css';
import SearchBar from './search-bar/search-bar';
import SearchResults from './search-results/search-results';
import UpdateBox from './update-box/update-box';
import FeaturedArticle from './pinned-article/pinned-article';
import MoreStories from './more-stories/more-stories';
import {blurbModel} from './article-summary/article-summary';
import Article from './article/article';
import DisqusForm from './disqus-form/disqus-form';

function slugsSortedByArticleDate(articles) {
    return Object.keys(articles)
        .sort((a, b) => articles[a].date < articles[b].date ? 1 : -1);
}

const path = '/blog';
const spec = {
    css,
    view: {
        classes: ['blog', 'page'],
        tag: 'main'
    },
    slug: 'news',
    timersRunning: [],
    articleSlug: null
};
const BaseClass = componentType(spec, canonicalLinkMixin, loaderMixin);

export default class Blog extends BaseClass {

    init() {
        super.init();
        this.hpcListener = this.handlePathChange.bind(this);
        window.addEventListener('navigate', this.hpcListener);
    }

    get featuredArticleOptions() {
        if (!this.pageData) {
            return {};
        }
        const articleSlug = Reflect.ownKeys(this.pageData.articles)
            .find((k) => this.pageData.articles[k].pin_to_top);
        const pinnedData = this.pageData.articles[articleSlug];

        return {
            model: blurbModel(articleSlug, pinnedData)
        };
    }

    moreStoriesOptions(test) {
        if (!this.pageData) {
            return {};
        }
        const articles = this.pageData.articles;
        const slugs = Reflect.ownKeys(articles)
            .filter((k) => test(k, articles[k]))
            .sort((a, b) => articles[a].date < articles[b].date ? 1 : -1);

        return slugs.map((s) => blurbModel(s, this.pageData.articles[s]));
    }

    buildDefaultPage() {
        const fa = new FeaturedArticle(this.featuredArticleOptions);
        // -- Future feature
        // const sb = new SearchBar({
        //     model: {
        //         title: 'Read more great stories'
        //     }
        // });
        const ub = new UpdateBox({
            model: {
                rssUrl: `${settings.apiOrigin}/blog-feed/rss/`
            }
        });
        const ms = new MoreStories({
            articles: this.moreStoriesOptions((_, articleEntry) => !articleEntry.pin_to_top)
        });

        // -- Future feature, cont'd
        // sb.on('value', (searchParam) => {
        //     history.pushState({}, '', `${path}/?${searchParam}`);
        //     this.handlePathChange();
        // });
        this.regions.self.attach(fa);
        // this.regions.self.append(sb);
        this.regions.self.append(ub);
        this.regions.self.append(ms);
    }

    buildSearchResultsPage() {
        const sb = new SearchBar({
            model: {
                title: 'Read more great stories'
            }
        });
        const sr = new SearchResults();

        sb.on('value', (searchParam) => {
            history.pushState({}, '', `${path}/?${searchParam}`);
            this.handlePathChange();
        });
        this.regions.self.attach(sb);
        this.regions.self.append(sr);
    }

    buildArticlePage() {
        const region = this.regions.self;

        region.attach(new Article({
            slug: `news/${this.articleSlug}`
        }));
        region.append(new DisqusForm());
        region.append(new UpdateBox({
            model: {
                rssUrl: `${settings.apiOrigin}/blog-feed/rss/`
            }
        }));
        region.append(new MoreStories({
            articles: this.moreStoriesOptions((slug, _) => slug !== this.articleSlug)
        }));
    }

    // eslint-disable-next-line complexity
    handlePathChange() {
        const slugMatch = window.location.pathname.match(/\/blog\/(.+)/);

        if (!slugMatch) {
            this.articleSlug = null;
            this.setCanonicalLink('/blog', this.canonicalLink);

            if (window.location.search) {
                this.buildSearchResultsPage();
            } else {
                this.buildDefaultPage();
            }
            return;
        }

        const articleSlug = slugMatch[1];

        if (!this.articles[articleSlug]) {
            routerBus.emit('navigate', '/404', {path: '/blog'}, true);
            return;
        }
        if (this.articleSlug !== articleSlug) {
            this.articleSlug = articleSlug;
            this.setTimers();
            this.setCanonicalLink(slugMatch[0], this.canonicalLink);
            this.buildArticlePage();
        }
    }

    setTimers() {
        const fireAt = [
            [0, '0-10 seconds', '0-10 seconds'],
            [11, '11-30 seconds', '11-30 seconds'],
            [31, '31 sec - 1 min', '31-60 seconds'],
            [61, '1-2 minutes', '61-120 seconds'],
            [121, '2-3 minutes', '121-180 seconds'],
            [181, '3-4 minutes', '181-240 seconds'],
            [241, '4-5 minutes', '241-300 seconds'],
            [301, '5-10 minutes', '301-600 seconds'],
            [601, '10-30 minutes', '601-1800 seconds'],
            [1801, 'over 30 min', '1801+ seconds']
        ];
        const action = 'time spent';

        this.clearTimers();
        this.timersRunning = fireAt.map(([sec, category, label], i) => {
            return setTimeout(() => {
                analytics.sendPageEvent(`TimeOnPage ${category}`, action, label);
            }, sec * 1000);
        });
    }

    clearTimers() {
        for (const timer of this.timersRunning) {
            clearTimeout(timer);
        }
    }

    onDataLoaded() {
        if (!this.articles) {
            this.articleSlugs = slugsSortedByArticleDate(this.pageData.articles);
            this.articles = this.articleSlugs.reduce(
                (dict, slug) => {
                    dict[slug] = Object.assign({slug}, this.pageData.articles[slug]);
                    return dict;
                },
                {}
            );
            this.handlePathChange();
        }
        this.hideLoader();
        this.setTimers();
    }

    onClose() {
        this.clearTimers();
        window.removeEventListener('navigate', this.hpcListener);
        super.onClose();
    }

    @on('click a[href^="/blog"]')
    saveArticleState(event) {
        event.preventDefault();
        const href = event.delegateTarget.href;

        routerBus.emit('navigate', href, {
            model: this.model,
            path: '/blog',
            x: 0,
            y: 0
        });
    }

}

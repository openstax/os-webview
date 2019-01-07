import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import settings from 'settings';
import {on} from '~/helpers/controller/decorators';
import router from '~/router';
import analytics from '~/helpers/analytics';
import Article from './article/article';
import {description as template} from './blog.html';
import css from './blog.css';

const spec = {
    template,
    css,
    view: {
        classes: ['blog', 'page'],
        tag: 'main'
    },
    regions: {
        articles: '.articles .container',
        pinned: '.pinned',
        articlePage: '.article.page'
    },
    slug: 'news',
    model: {
        rssUrl: `${settings.apiOrigin}/blog-feed/rss/`
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin, loaderMixin);

export default class Blog extends BaseClass {

    static description = 'Stay up to date with OpenStax news and hear community '+
    'perspectives on issues in education and access on the OpenStax blog.';

    init() {
        super.init();
        this.timersRunning = [];
        this.previousSlug = null;

        // eslint-disable-next-line complexity
        this.handlePathChange = () => {
            if (history && history.state && history.state.model) {
                Object.assign(this.model, history.state.model);
            }
            const slugMatch = window.location.pathname.match(/\/blog\/(.+)/);

            if (slugMatch) {
                this.model.articleSlug = slugMatch[1];
                if (!this.articles[this.model.articleSlug]) {
                    router.navigate('/404', {path: '/blog'}, true);
                    return;
                }
                if (this.previousSlug !== slugMatch[1]) {
                    this.previousSlug = slugMatch[1];
                    this.setTimers();
                    this.setCanonicalLink(slugMatch[0], this.canonicalLink);
                }
            } else {
                this.model.articleSlug = null;
                this.setCanonicalLink('/blog', this.canonicalLink);
            }
            this.update();
        };
        window.addEventListener('navigate', this.handlePathChange);
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
            this.articleSlugs = Object.keys(this.pageData.articles)
                .sort((a, b) => {
                    const articleA = this.pageData.articles[a];
                    const articleB = this.pageData.articles[b];

                    return articleA.date < articleB.date ? 1 : -1;
                });

            this.articles = {};
            for (const slug of this.articleSlugs) {
                const article = Object.assign({slug}, this.pageData.articles[slug]);

                if (article.pin_to_top) {
                    this.model.pinnedArticleSlug = slug;
                }
                this.articles[slug] = article;
            }
            this.handlePathChange();
        }
        this.hideLoader();
        this.setTimers();
    }

    onUpdate() {
        if (this.articles) {
            this.regions.articlePage.empty();
            this.regions.pinned.empty();
            if (this.model.articleSlug) {
                const articleData = this.articles[this.model.articleSlug];
                const articleController = new Article(articleData);

                articleController.setMode('page');
                this.regions.articlePage.attach(articleController);
                this.otherArticles(this.model.articleSlug);
            } else if (this.model.pinnedArticleSlug) {
                const articleData = this.articles[this.model.pinnedArticleSlug];
                const articleController = new Article(articleData);

                articleController.setMode('pinned');
                this.regions.pinned.append(articleController);
                this.otherArticles(this.model.pinnedArticleSlug);
            } else {
                this.otherArticles();
            }
        }
    }

    onClose() {
        this.clearTimers();
        window.removeEventListener('navigate', this.handlePathChange);
        super.onClose();
    }

    otherArticles(exceptThisSlug) {
        this.regions.articles.empty();
        this.articleSlugs
            .filter((s) => s !== exceptThisSlug)
            .forEach((slug) => {
                this.regions.articles.append(new Article(this.articles[slug]));
            });
    }

    @on('click a[href^="/blog"]')
    saveArticleState(event) {
        event.preventDefault();
        const href = event.delegateTarget.href;

        router.navigate(href, {
            model: this.model,
            path: '/blog',
            x: 0,
            y: 0
        });
    }

}

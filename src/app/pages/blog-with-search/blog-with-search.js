import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import settings from 'settings';
import {on} from '~/helpers/controller/decorators';
import routerBus from '~/helpers/router-bus';
import analytics from '~/helpers/analytics';
import Article from './article/article';
import css from './blog.css';

function slugsSortedByArticleDate(articles) {
    return Object.keys(articles)
        .sort((a, b) => {
            const articleA = articles[a];
            const articleB = articles[b];

            return articleA.date < articleB.date ? 1 : -1;
        });
}

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

    // eslint-disable-next-line complexity
    handlePathChange() {
        const slugMatch = window.location.pathname.match(/\/blog-with-search\/(.+)/);

        console.info('Tried to match', window.location.pathname);
        if (!slugMatch) {
            this.articleSlug = null;
            this.setCanonicalLink('/blog', this.canonicalLink);
            return;
        }

        const articleSlug = slugMatch[1];

        console.info('So...articleSlug', articleSlug);
        if ((/^search/).test(articleSlug)) {
            console.info('Search results');
            this.setCanonicalLink('/blog/search', this.canonicalLink);
            return;
        }
        if (!this.articles[articleSlug]) {
            routerBus.emit('navigate', '/404', {path: '/blog'}, true);
            return;
        }
        if (this.articleSlug !== articleSlug) {
            this.articleSlug = articleSlug;
            this.setTimers();
            this.setCanonicalLink(slugMatch[0], this.canonicalLink);
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

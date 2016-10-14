import settings from 'settings';
import {on} from '~/helpers/controller/decorators';
import router from '~/router';
import CMSPageController from '~/controllers/cms';
import Article from './article/article';
import {description as template} from './blog.html';


function slugWithNewsPrefix(slug) {
    if (!(/^news\//).test(slug)) {
        return `news/${slug}`;
    }
    return slug;
}

export default class Blog extends CMSPageController {

    static description = 'Stay up to date with OpenStax news and hear community '+
    'perspectives on issues in education and access on the OpenStax blog.';

    init() {
        this.template = template;
        this.css = '/app/pages/blog/blog.css';
        this.view = {
            classes: ['blog', 'page']
        };
        this.regions = {
            articles: '.articles .container',
            pinned: '.pinned',
            articlePage: '.article.page'
        };
        this.slug = '/news';

        this.model = {};

        this.handlePathChange = () => {
            if (history && history.state && history.state.model) {
                Object.assign(this.model, history.state.model);
            }
            const slugMatch = window.location.pathname.match(/\/blog\/(.+)/);

            if (slugMatch) {
                this.model.articleSlug = slugWithNewsPrefix(slugMatch[1]);
                if (!this.articles[this.model.articleSlug]) {
                    router.navigate('/404', {path: '/blog'});
                    return;
                }
            }
            this.update();
        };
        window.addEventListener('popstate', this.handlePathChange);
        window.addEventListener('navigate', this.handlePathChange);
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
            for (const rawSlug of this.articleSlugs) {
                const slug = slugWithNewsPrefix(rawSlug);
                const article = Object.assign({slug}, this.pageData.articles[slug]);

                if (article.pin_to_top) {
                    this.model.pinnedArticleSlug = slug;
                }
                this.articles[slug] = article;
            }
            this.handlePathChange();
        }
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
        window.removeEventListener('popstate', this.handlePathChange);
        window.removeEventListener('navigate', this.handlePathChange);
    }

    otherArticles(exceptThisSlug) {
        this.regions.articles.empty();
        for (const slug of this.articleSlugs.filter((s) => s !== exceptThisSlug)) {
            this.regions.articles.append(new Article(this.articles[slug]));
        }
    }

    @on('click a[href^="/blog"]')
    saveArticleState(event) {
        event.preventDefault();
        const href = event.delegateTarget.href;

        router.navigate(href, {
            model: this.model,
            path: '/blog',
            x: history.state.x,
            y: history.state.y
        });
    }

}

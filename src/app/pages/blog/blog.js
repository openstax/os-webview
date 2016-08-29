import settings from 'settings';
import CMSPageController from '~/controllers/cms';
import Article from './article/article';
import {description as template} from './blog.html';

export default class Blog extends CMSPageController {

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

        const slugMatch = window.location.pathname.match(/\/blog\/(.+)/);

        if (slugMatch) {
            const slug = slugMatch[1];

            this.model.articleSlug = slugMatch[1];
        }

        this.handlePathChange = () => {
            Object.assign(this.model, history.state.model);
            this.update();
        };
        window.addEventListener('popstate', this.handlePathChange);
    }

    onDataLoaded() {
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
                this.pinnedArticleSlug = slug;
            }
            this.articles[slug] = article;
        }
        this.update();
    }

    onUpdate() {
        if (this.articles) {
            this.regions.articlePage.empty();
            this.regions.pinned.empty();
            if (this.model.articleSlug) {
                const articleController = new Article(this.articles[this.model.articleSlug]);

                articleController.setMode('page');
                this.regions.articlePage.attach(articleController);
                this.otherArticles(this.model.articleSlug);
            } else {
                const articleController = new Article(this.articles[this.pinnedArticleSlug]);

                articleController.setMode('pinned');
                this.regions.pinned.append(articleController);
                this.otherArticles(this.pinnedArticleSlug);
            }
        }
    }

    onClose() {
        window.removeEventListener('popstate', this.handlePathChange);
    }

    otherArticles(exceptThisSlug) {
        this.regions.articles.empty();
        for (const slug of this.articleSlugs.filter((s) => s !== exceptThisSlug)) {
            this.regions.articles.append(new Article(this.articles[slug]));
        }
    }

}

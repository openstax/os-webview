import settings from 'settings';
import CMSPageController from '~/controllers/cms';
import Articles from './articles/articles';
import PinnedArticle from './pinned-article/pinned-article';
import {description as template} from './blog.html';

export default class Blog extends CMSPageController {

    init() {
        this.template = template;
        this.css = '/app/pages/blog/blog.css';
        this.view = {
            classes: ['blog', 'page']
        };
        this.regions = {
            articles: '.articles',
            pinned: '.pinned'
        };
        this.slug = 'news';
    }

    onDataLoaded() {
        const articles = Object.keys(this.pageData.articles).map((key) => this.pageData.articles[key]);
        const pinnedArticles = articles.filter((article) => article.pin_to_top);
        const otherArticles = articles.filter((article) => !article.pin_to_top);

        for (const article of pinnedArticles) {
            this.regions.pinned.append(new PinnedArticle(article));
        }
        this.regions.articles.append(new Articles(otherArticles));
    }

}

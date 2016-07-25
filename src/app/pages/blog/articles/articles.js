import CMSPageController from '~/controllers/cms';
import {description as template} from './articles.html';
import Article from '../article/article';
import newsQuery from '../newsPromise';

export default class Articles extends CMSPageController {

    init(excludeSlug) {
        this.template = template;
        this.css = '/app/pages/blog/articles/articles.css';
        this.view = {
            classes: ['boxed']
        };
        this.regions = {
            article: '.container'
        };
        this.excludeSlug = excludeSlug;
        this.query = newsQuery;
    }

    onDataLoaded() {
        const sortedArticles = this.pageData.pages.sort((a, b) => a.date < b.date ? 1 : -1);

        for (const article of sortedArticles) {
            if (article.slug !== this.excludeSlug) {
                this.regions.article.append(new Article(article));
            }
        }
    }

}

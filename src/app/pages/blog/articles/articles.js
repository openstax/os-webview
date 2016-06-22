import {Controller} from 'superb';
import {description as template} from './articles.html';
import Article from '../article/article';
import newsPromise from '../newsPromise';

export default class Articles extends Controller {

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
    }

    onLoaded() {
        newsPromise.then((newsData) => {
            const sortedArticles = newsData.pages.sort((a, b) => a.date < b.date ? 1 : -1);

            for (const article of sortedArticles) {
                if (article.slug !== this.excludeSlug) {
                    this.regions.article.append(new Article(article));
                }
            }
        });
    }

}

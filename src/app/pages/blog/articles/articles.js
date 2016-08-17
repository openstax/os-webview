import {Controller} from 'superb';
import {description as template} from './articles.html';
import Article from '../article/article';

export default class Articles extends Controller {

    init(articles) {
        this.template = template;
        this.css = '/app/pages/blog/articles/articles.css';
        this.view = {
            classes: ['boxed']
        };
        this.regions = {
            article: '.container'
        };
        this.articles = articles;
    }

    onLoaded() {
        const sortedArticles = this.articles.sort((a, b) => a.date < b.date ? 1 : -1);

        for (const article of sortedArticles) {
            this.regions.article.append(new Article(article));
        }
    }

}

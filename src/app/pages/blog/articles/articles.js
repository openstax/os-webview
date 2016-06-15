import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './articles.hbs';
import Article from '../article/article';
import newsPromise from '../newsPromise';

@props({
    template: template,
    css: '/app/pages/blog/articles/articles.css',
    regions: {
        article: '.container'
    }
})

export default class Articles extends BaseView {

    constructor(excludeSlug) {
        super();

        this.excludeSlug = excludeSlug;
    }

    onRender() {
        this.el.classList.add('boxed');
        newsPromise.then((newsData) => {
            let sortedArticles = newsData.pages.sort((a, b) => a.date < b.date ? 1 : -1);

            for (let article of sortedArticles) {
                if (article.slug !== this.excludeSlug) {
                    this.regions.article.append(new Article(article));
                }
            }
        });
    }
}

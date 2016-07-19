import settings from 'settings';
import LoadingView from '~/controllers/loading-view';
import Articles from './articles/articles';
import PinnedArticle from './pinned-article/pinned-article';
import newsPromise from './newsPromise';
import {description as template} from './blog.html';

export default class Blog extends LoadingView {

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
    }

    onLoaded() {
        // document.body.classList.add('no-scroll');

        newsPromise.then((newsData) => {
            const pinnedArticles = newsData.pages.filter((article) => article.pin_to_top);

            for (const article of pinnedArticles) {
                this.regions.pinned.append(new PinnedArticle(article));
                this.regions.articles.append(new Articles(article.slug));
            }
        });
    }

}

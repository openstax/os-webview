import LoadingView from '~/controllers/loading-view';
import cms from '~/helpers/cms';
import Articles from '../blog/articles/articles';
import bodyUnitView from '~/components/body-units/body-units';
import {description as template} from './article.html';
import {formatDateForBlog as formatDate} from '~/helpers/data';

export default class Article extends LoadingView {

    init() {
        this.template = template;
        this.css = '/app/pages/article/article.css';
        this.regions = {
            articles: '.articles',
            body: '.body'
        };
        this.model = {};
    }

    // Because of how the router calls this, slug is not populated in init, only here
    constructor(slug) {
        super();
        cms.query({
            type: 'news.NewsArticle',
            fields: ['slug', 'title', 'date', 'author', 'pin_to_top', 'subheading', 'body', 'article_image'],
            slug
        }).then((newsData) => {
            this.model = newsData.pages[0];
            this.model.date = formatDate(this.model.date);
            document.title = `${this.model.title} - Openstax`;
            this.update();
        });
    }

    onUpdate() {
        if (this.model.body) {
            for (const bodyUnit of this.model.body) {
                this.regions.body.append(bodyUnitView(bodyUnit));
            }
        }
        if (this.model.slug) {
            this.regions.articles.append(new Articles(this.model.slug));
        }
    }

    onLoaded() {
        const d = document;
        const s = d.createElement('script');

        s.src = '//openstax.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date()); (d.head || d.body).appendChild(s);

        const s2 = d.createElement('script');

        s2.src = '//openstax.disqus.com/count.js';
        s2.setAttribute('data-timestamp', +new Date()); (d.body).appendChild(s2);
    }

}

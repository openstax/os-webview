import {Controller} from 'superb';
import bodyUnitView from '~/components/body-units/body-units';
import {description as template} from './article.html';
import {formatDateForBlog as formatDate} from '~/helpers/data';

export default class Article extends Controller {

    init(article) {
        this.template = template;
        this.css = '/app/pages/blog/article/article.css';
        this.view = {
            classes: ['article']
        };
        this.regions = {
            body: '.body'
        };
        this.model = {
            coverUrl: article.article_image || 'http://placehold.it/370x240',
            title: article.subheading,
            author: article.author,
            date: formatDate(article.date),
            articleSlug: article.slug
        };
    }

    onDataLoaded() {
        for (const bodyUnit of this.pageData.body) {
            this.regions.body.append(bodyUnitView(bodyUnit));
        }
    }

}

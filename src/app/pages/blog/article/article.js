import {Controller} from 'superb';
import bodyUnitView from '~/components/body-units/body-units';
import {description as template} from './article.html';
import {formatDateForBlog as formatDate} from '~/helpers/data';

export default class Article extends Controller {

    init(data) {
        this.template = template;
        this.css = '/app/pages/blog/article/article.css';
        this.view = {
            classes: ['article']
        };
        this.regions = {
            body: '.body'
        };
        this.model = {
            coverUrl: data.article_image || 'http://placehold.it/370x240',
            title: data.title,
            author: data.author,
            date: formatDate(data.date),
            articleSlug: data.slug
        };

        this.data = data;
    }

    onLoaded() {
        for (const bodyUnit of this.data.body) {
            this.regions.body.append(bodyUnitView(bodyUnit));
        }
    }

}

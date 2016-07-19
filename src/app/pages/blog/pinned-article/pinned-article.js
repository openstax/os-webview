import {Controller} from 'superb';
import {description as template} from './pinned-article.html';
import bodyUnitView from '~/components/body-units/body-units';
import {formatDateForBlog as formatDate} from '~/helpers/data';

export default class PinnedArticle extends Controller {

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
            coverUrl: data.article_image || 'http://placehold.it/570x270',
            articleSlug: data.slug,
            title: data.title,
            author: data.author,
            subheading: data.subheading,
            date: formatDate(data.date)
        };
        this.body = data.body;
    }

    onLoaded() {
        for (const bodyUnit of this.body) {
            this.regions.body.append(bodyUnitView(bodyUnit));
        }
    }

}

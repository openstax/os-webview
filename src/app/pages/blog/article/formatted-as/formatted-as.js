import {Controller} from 'superb';
import bodyUnitView from '~/components/body-units/body-units';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import {description as featureTemplate} from './feature.html';
import {description as synopsisTemplate} from './synopsis.html';

export default class FormattedAs extends Controller {

    init(format, article) {
        this.template = format === 'feature' ? featureTemplate : synopsisTemplate;
        this.model = Object.assign({
            coverUrl: article.article_image || 'http://placehold.it/370x240',
            date: formatDate(article.date),
            articleSlug: article.slug
        }, article);
        this.regions = {
            body: '.body'
        };
        this.view = {
            classes: ['article']
        };
    }

    onLoaded() {
        for (const bodyUnit of this.model.body) {
            this.regions.body.append(bodyUnitView(bodyUnit));
        }
    }

}

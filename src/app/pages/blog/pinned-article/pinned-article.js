import CMSPageController from '~/controllers/cms';
import {description as template} from './pinned-article.html';
import bodyUnitView from '~/components/body-units/body-units';
import {formatDateForBlog as formatDate} from '~/helpers/data';

export default class PinnedArticle extends CMSPageController {

    init(data) {
        this.template = template;
        this.css = '/app/pages/blog/article/article.css';
        this.view = {
            classes: ['article']
        };
        this.regions = {
            body: '.body'
        };
        this.slug = data.slug;
        this.model = {
            coverUrl: data.article_image || 'http://placehold.it/570x270',
            articleSlug: data.slug,
            title: data.title,
            author: data.author,
            subheading: data.subheading,
            date: formatDate(data.date)
        };
    }

    onDataLoaded() {
        for (const bodyUnit of this.pageData.body) {
            this.regions.body.append(bodyUnitView(bodyUnit));
        }
    }

}

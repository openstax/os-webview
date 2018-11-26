import bodyUnitView from '~/components/body-units/body-units';
import CMSPageController from '~/controllers/cms';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import {description as template} from './article.html';
import css from '~/pages/blog/article/article.css';

export default class Article extends CMSPageController {

    init(slug) {
        this.template = template;
        this.view = {
            classes: ['article']
        };
        this.regions = {
            body: '.body'
        };
        this.slug = slug;
        this.css = css;
        this.model = {};
        this.preserveWrapping = true;
    }

    onDataLoaded() {
        this.model = {
            author: this.pageData.author,
            coverUrl: this.pageData.article_image,
            date: formatDate(this.pageData.date),
            heading: this.pageData.heading,
            subheading: this.pageData.subheading,
            title: this.pageData.title
        };
        this.update();
        this.pageData.body.forEach((bodyUnit) => {
            this.regions.body.append(bodyUnitView(bodyUnit));
        });
    }

}

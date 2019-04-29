import componentType from '~/helpers/controller/init-mixin';
import bodyUnitView from '~/components/body-units/body-units';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import {description as template} from './article.html';
import css from '~/pages/blog/article/article.css';

const spec = {
    template,
    css,
    view: {
        classes: ['article']
    },
    regions: {
        body: '.body'
    },
    slug: 'setInInit',
    model: {}
};

export default class Article extends componentType(spec) {

    init(slug) {
        super.init();
        this.slug = slug;
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

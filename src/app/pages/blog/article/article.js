import CMSPageController from '~/controllers/cms';
import FormattedAs from './formatted-as/formatted-as';

export default class Article extends CMSPageController {

    init(article, mode) {
        this.template = () => '';
        this.css = '/app/pages/blog/article/article.css';
        this.view = {
            classes: ['article']
        };
        this.slug = article.slug;
        this.preserveWrapping = true;
    }

    setMode(mode) {
        this.mode = mode;
        this.update();
    }

    onDataLoaded() {
        if (this.el) {
            this.update();
        }
    }

    onUpdate() {
        if (this.pageData && this.regions) {
            const formattedContent = new FormattedAs(this.mode === 'page' ? 'feature' : 'synopsis', this.pageData);

            this.regions.self.attach(formattedContent);
        }
    }

}

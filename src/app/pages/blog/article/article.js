import CMSPageController from '~/controllers/cms';
import FormattedAs from './formatted-as/formatted-as';

export default class Article extends CMSPageController {

    init(article, mode) {
        this.template = () => null;
        this.css = '/app/pages/blog/article/article.css';
        this.view = {
            classes: ['article']
        };
        this.slug = article.slug;
    }

    setMode(mode) {
        this.mode = mode;
        this.update();
    }

    onDataLoaded() {
        this.update();
    }

    onUpdate() {
        if (this.pageData) {
            const formattedContent = new FormattedAs(this.mode === 'page' ? 'feature' : 'synopsis', this.pageData);

            this.regions.self.attach(formattedContent);
        }
    }

}

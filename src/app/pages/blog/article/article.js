import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import router from '~/router';
import bodyUnitView from '~/components/body-units/body-units';
import {description as template} from './article.html';
import {formatDateForBlog as formatDate} from '~/helpers/data';

export default class Article extends Controller {

    init(article, mode) {
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
            title: article.heading || 'Untitled',
            subheading: article.subheading,
            author: article.author,
            date: formatDate(article.date),
            articleSlug: article.slug,
            mode
        };
    }

    setMode(mode) {
        this.model.mode = mode;
        this.update();
    }

    onDataLoaded() {
        for (const bodyUnit of this.pageData.body) {
            this.regions.body.append(bodyUnitView(bodyUnit));
        }
    }

    @on('click a[href^="/blog"]')
    saveArticleState(event) {
        event.preventDefault();
        const href = event.delegateTarget.href;

        router.navigate(href, {
            model: this.model,
            path: '/blog',
            x: history.state.x,
            y: history.state.y
        });
    }

}

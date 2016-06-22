import {Controller} from 'superb';
import {description as template} from './pinned-article.html';
import bodyUnits from '~/components/body-units/body-units';

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
        this.templateHelpers = {
            coverUrl: data.article_image || 'http://placehold.it/370x240',
            articleSlug: data.slug,
            title: data.title,
            author: data.author,
            subheading: data.subheading
        };
        this.data = data;
    }

    onLoaded() {
        for (const bodyUnit of this.data.body) {
            const View = bodyUnits[bodyUnit.type];

            this.regions.body.append(new View(bodyUnit.value));
        }

        const d = new Date(this.data.date).toUTCString().split(' ');
        const formatDate = `${d[2]} ${d[1]}, ${d[3]}`;

        // FIX: This should be part of the template
        for (const el of this.el.querySelectorAll('[data-id="date"]')) {
            el.innerHTML = formatDate;
        }

        // FIX: This should be part of the template
        for (const el of this.el.querySelectorAll('.img')) {
            el.setAttribute('style', `background-image:url(${this.data.article_image})`);
        }
    }

}

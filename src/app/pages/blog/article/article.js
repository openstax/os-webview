import {Controller} from 'superb';
import bodyUnits from '~/components/body-units/body-units';
import {description as template} from './article.html';

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
        this.templateHelpers = {
            coverUrl: data.article_image || 'http://placehold.it/370x240',
            title: data.title,
            author: data.author,
            date: data.date,
            articleSlug: data.slug
        };

        this.data = data;
    }

    onLoaded() {
        const d = new Date(this.data.date).toUTCString().split(' ');
        const formatDate = `${d[2]} ${d[1]}, ${d[3]}`;

        for (const el of this.el.querySelectorAll('.date')) {
            el.innerHTML = formatDate;
        }

        for (const bodyUnit of this.data.body) {
            const View = bodyUnits[bodyUnit.type];

            this.regions.body.append(new View(bodyUnit.value));
        }

        for (const el of this.el.querySelectorAll('.img')) {
            el.setAttribute('style', `background-image:url(${this.data.article_image})`);
        }
    }

}

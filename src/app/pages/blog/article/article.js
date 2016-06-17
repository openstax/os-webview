import BaseView from '~/helpers/backbone/view';
import bodyUnits from '~/components/body-units/body-units';
import {props} from '~/helpers/backbone/decorators';
import {template} from './article.hbs';

@props({
    template: template,
    css: '/app/pages/blog/article/article.css',
    regions: {
        body: '.body'
    }
})

export default class Article extends BaseView {

    constructor(data) {
        super();

        this.templateHelpers = {
            coverUrl: data.article_image || 'http://placehold.it/370x240',
            title: data.title,
            author: data.author,
            date: data.date,
            articleSlug: data.slug
        };

        this.data = data;
    }

    onRender() {
        this.el.classList.add('article');

        let d = new Date(this.data.date).toUTCString().split(' ');
        let formatDate = `${d[2]} ${d[1]}, ${d[3]}`;

        for (let el of this.el.querySelectorAll('.date')) {
            el.innerHTML = formatDate;
        }

        for (let bodyUnit of this.data.body) {
            let View = bodyUnits[bodyUnit.type];

            this.regions.body.append(new View(bodyUnit.value));
        }

        for (let el of this.el.querySelectorAll('.img')) {
            el.setAttribute('style', `background-image:url(${this.data.article_image})`);
        }
    }
}

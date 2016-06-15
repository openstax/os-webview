import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './article.hbs';

@props({
    template: template,
    css: '/app/pages/blog/article/article.css'
})

export default class Article extends BaseView {

    constructor(data) {
        super();

        this.templateHelpers = {
            coverUrl: data.article_image || 'http://placehold.it/370x240',
            title: data.title,
            body: data.body,
            author: data.author,
            date: data.date,
            articleSlug: data.slug
        };

        this.data = data;
    }

    onRender() {
        this.el.classList.add('article');

        let d = new Date(this.data.date).toDateString().split(' ');
        let formatDate = `${d[1]} ${d[2]}, ${d[3]}`;

        for (let el of this.el.querySelectorAll('.date')) {
            el.innerHTML = formatDate;
        }

        for (let el of this.el.querySelectorAll('.img')) {
            el.setAttribute('style', `background-image:url(${this.data.article_image})`);
        }
    }
}

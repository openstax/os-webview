import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './pinned-article.hbs';

@props({
    template: template,
    css: '/app/pages/blog/article/article.css'
})

export default class PinnedArticle extends BaseView {

    constructor(data) {
        super();

        this.templateHelpers = {
            coverUrl: data.article_image || 'http://placehold.it/370x240',
            articleSlug: data.slug
        };

        this.data = data;
    }

    onRender() {
        this.el.classList.add('article');
        let populateDataIdItems = (data) => {
            for (let el of this.el.querySelectorAll('[data-id]')) {
                let key = el.dataset.id;

                if (key in data) {
                    el.innerHTML = data[key];
                }
            }
        };

        populateDataIdItems(this.data);

        let d = new Date(this.data.date).toDateString().split(' ');
        let formatDate = `${d[1]} ${d[2]}, ${d[3]}`;

        for (let el of this.el.querySelectorAll('[data-id="date"]')) {
            el.innerHTML = formatDate;
        }

        for (let el of this.el.querySelectorAll('.img')) {
            el.setAttribute('style', `background-image:url(${this.data.article_image})`);
        }
    }
}

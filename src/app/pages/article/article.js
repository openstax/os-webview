import LoadingView from '~/helpers/backbone/loading-view';
import {template as strips} from '~/components/strips/strips.hbs';
import {props} from '~/helpers/backbone/decorators';
import {template} from './article.hbs';
import Articles from '../blog/articles/articles';
import bodyUnits from '~/components/body-units/body-units';
import PageModel from '~/models/pagemodel';

@props({
    template: template,
    css: '/app/pages/article/article.css',
    templateHelpers: {strips},
    regions: {
        articles: '.articles',
        body: '.body'
    }
})
export default class Article extends LoadingView {

    onLoaded() {
        super.onLoaded();
        this.el.querySelector('.article.page').classList.remove('hidden');
        document.body.classList.remove('no-scroll');
    }

    onRender() {
        document.body.classList.add('no-scroll');
        this.el.querySelector('.article.page').classList.add('hidden');

        let slug = window.location.pathname.replace(/.*\//, ''),
            doDataIdSubstitutions = (data, elements) => {
                for (let el of elements) {
                    let key = el.dataset.id;

                    if (key in data) {
                        el.innerHTML = data[key];
                    } else {
                        el.parentNode.removeChild(el);
                    }
                }
            };

        new PageModel().fetch({
            data: {
                type: 'news.NewsArticle',
                slug: slug
            }
        }).then((data) => {
            new PageModel().fetch({url: data.pages[0].meta.detail_url}).then((articleData) => {
                document.title = `${articleData.title} - Openstax`;
                doDataIdSubstitutions(articleData, this.el.querySelectorAll('[data-id]'));

                for (let bodyUnit of articleData.body) {
                    let View = bodyUnits[bodyUnit.type];

                    this.regions.body.append(new View(bodyUnit.value));
                }

                let articleImage = articleData.article_image || 'http://placehold.it/1400x600';

                this.el.querySelector('.hero').setAttribute('style', `background-image:url(${articleImage})`);

                let d = new Date(articleData.date).toUTCString().split(' ');
                let formatDate = `${d[2]} ${d[1]}, ${d[3]}`;

                this.el.querySelector('[data-id="date"]').innerHTML = formatDate;
                let newTags = [];

                for (let tag of articleData.tags) {
                    let spanObj = `<span>${tag}</span>`;

                    newTags += spanObj;
                }

                this.el.querySelector('.tags').innerHTML = newTags;
            });
        });

        this.regions.articles.append(new Articles(slug));

        let d = document,
            s = d.createElement('script');

        s.src = '//openstax.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date()); (d.head || d.body).appendChild(s);

        let d2 = document,
            s2 = d2.createElement('script');

        s2.src = '//openstax.disqus.com/count.js';
        s2.setAttribute('data-timestamp', +new Date()); (d2.body).appendChild(s2);

        super.onRender();
    }
}

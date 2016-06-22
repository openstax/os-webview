import LoadingView from '~/controllers/loading-view';
// import Articles from '../blog/articles/articles';
// import bodyUnits from '~/components/body-units/body-units';
// import PageModel from '~/models/pagemodel';
import {description as template} from './article.html';

export default class Article extends LoadingView {

    init() {
        this.template = template;
        this.css = '/app/pages/article/article.css';
        this.regions = {
            articles: '.articles',
            body: '.body'
        };
    }

    /*
    onLoaded() {
        this.el.querySelector('.article.page').classList.add('hidden');

        const slug = window.location.pathname.replace(/.*\//, '');
        const doDataIdSubstitutions = (data, elements) => {
            for (const el of elements) {
                const key = el.dataset.id;

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

                for (const bodyUnit of articleData.body) {
                    const View = bodyUnits[bodyUnit.type];

                    this.regions.body.append(new View(bodyUnit.value));
                }

                const articleImage = articleData.article_image || 'http://placehold.it/1400x600';

                this.el.querySelector('.hero').setAttribute('style', `background-image:url(${articleImage})`);

                const d = new Date(articleData.date).toUTCString().split(' ');
                const formatDate = `${d[2]} ${d[1]}, ${d[3]}`;

                this.el.querySelector('[data-id="date"]').innerHTML = formatDate;

                let newTags = '';

                for (const tag of articleData.tags) {
                    const spanObj = `<span>${tag}</span>`;

                    newTags += spanObj;
                }

                this.el.querySelector('.tags').innerHTML = newTags;
            });
        });

        this.regions.articles.append(new Articles(slug));

        const d = document;
        const s = d.createElement('script');

        s.src = '//openstax.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date()); (d.head || d.body).appendChild(s);

        const d2 = document;
        const s2 = d2.createElement('script');

        s2.src = '//openstax.disqus.com/count.js';
        s2.setAttribute('data-timestamp', +new Date()); (d2.body).appendChild(s2);
    }
    */

}

import {Controller} from 'superb.js';
import {description as featureTemplate} from './feature.html';
import {description as synopsisTemplate} from './synopsis.html';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import $ from '~/helpers/$';
import bodyUnitView from '~/components/body-units/body-units';

export default class FormattedAs extends Controller {

    init(format, article) {
        this.template = format === 'feature' ? featureTemplate : synopsisTemplate;
        this.format = format;
        this.model = Object.assign({
            coverUrl: article.article_image || 'https://placehold.it/370x240',
            articleSlug: article.slug.replace('news/', ''),
            isVisible: false
        }, article);
        this.model.date = formatDate(article.date);
        this.regions = {
            body: '.body'
        };
        this.view = {
            classes: ['article']
        };
        if (format === 'feature') {
            $.setPageDescriptionAndTitle(
                article.meta.search_description,
                article.meta.seo_title || article.title
            );
        }
    }

    onLoaded() {
        const d = document;
        const disqusConfig = function () {
            this.page.url = window.location.href;
            this.page.identifier = window.location.pathname;
        };
        const loadDisqus = () => {
            /* eslint camelcase: 0 */
            const disqus_config = disqusConfig;
            const s = d.createElement('script');

            s.src = '//openstax.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);

            const s2 = d.createElement('script');

            s2.src = '//openstax.disqus.com/count.js';
            s2.setAttribute('date-timestamp', +new Date());
            d.body.appendChild(s2);
        };
        const reloadDisqus = () => {
            DISQUS.reset({
                reload: true,
                config: disqusConfig
            });
        };
        const startWithFirstP = () => {
            const body = this.model.body.slice(0, 1);
            const text = body[0].value;
            const firstP = text.match(/<p>/);

            if (firstP && firstP.index > 0) {
                body[0].value = text.substr(firstP.index);
            }
            this.model.body = body;
        };

        if (this.format === 'synopsis') {
            startWithFirstP();
        }
        for (const bodyUnit of this.model.body) {
            this.regions.body.append(bodyUnitView(bodyUnit));
        }
        if (this.format === 'synopsis') {
            const bodyLinks = this.regions.body.el.querySelectorAll('a');

            for (const el of bodyLinks) {
                el.tabIndex = -1;
            }
        }
        setTimeout(() => {
            const disqusThreadBlock = d.getElementById('disqus_thread');

            if (this.template === featureTemplate) {
                if (disqusThreadBlock) {
                    const disqusScript = d.querySelector('script[src*="openstax.disqus.com"]');

                    if (disqusScript) {
                        reloadDisqus();
                    } else {
                        loadDisqus();
                    }
                }
            }
        }, 0);
    }

}

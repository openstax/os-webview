import {Controller} from 'superb';
import bodyUnitView from '~/components/body-units/body-units';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import {description as featureTemplate} from './feature.html';
import {description as synopsisTemplate} from './synopsis.html';

export default class FormattedAs extends Controller {

    init(format, article) {
        this.template = format === 'feature' ? featureTemplate : synopsisTemplate;
        this.model = Object.assign({
            coverUrl: article.article_image || 'http://placehold.it/370x240',
            date: formatDate(article.date),
            articleSlug: article.slug
        }, article);
        this.regions = {
            body: '.body'
        };
        this.view = {
            classes: ['article']
        };
    }

    onLoaded() {
        const loadDisqus = () => {
            /* eslint camelcase: 0 */
            const disqus_config = function () {
                this.page.url = window.location.pathname;
                this.page.identifier = window.location.pathname;
            };
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
            try {
                DISQUS.reset({
                    reload: true,
                    config() {
                        this.page.identifier = window.location.pathname;
                        this.page.url = window.location.pathname;
                    }
                });
            } catch (e) {
                console.warn('Disqus reset failed', e);
            }
        };

        for (const bodyUnit of this.model.body) {
            this.regions.body.append(bodyUnitView(bodyUnit));
        }
        if (this.template === featureTemplate) {
            const d = document;

            if (d.getElementById('disqus_thread')) {
                const disqusScript = d.querySelector('script[src*="openstax.disqus.com"]');

                if (disqusScript) {
                    reloadDisqus();
                } else {
                    loadDisqus();
                }
            }
        }
    }

}

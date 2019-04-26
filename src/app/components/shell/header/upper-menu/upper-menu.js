import {Controller} from 'superb.js';
import settings from 'settings';
import {description as template} from './upper-menu.html';
import css from './upper-menu.css';

export default class UpperMenu extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['container']
        };
        this.css = css;
        this.model = {};

        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const newsUrl = await fetch(`${settings.apiOrigin}${settings.apiPrefix}/v2/pages/?slug=openstax-news`)
                    .then((response) => response.json())
                    .then((response) => response.items[0].meta.detail_url);
                const data = await fetch(newsUrl).then((response) => response.json());

                if (Reflect.has(data, 'articles') && Object.keys(data.articles).length) {
                    this.model.showBlog = true;
                    this.update();
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }

}

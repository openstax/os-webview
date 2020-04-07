import {Controller} from 'superb.js';
import settings from 'settings';
import {description as template} from './upper-menu.html';
import css from './upper-menu.css';
import cmsFetch from '~/models/cmsFetch';

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
                const data = await cmsFetch('pages/openstax-news');

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

import VERSION from '~/version';
import {Controller} from 'superb.js';
import settings from 'settings';
import {description as template} from './upper-menu.html';

export default class UpperMenu extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['container']
        };
        this.css = `/app/components/shell/header/upper-menu/upper-menu.css?${VERSION}`;
        this.model = model;

        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/news`);
                const data = await response.json();

                if (Object.keys(data.articles).length) {
                    this.model.showBlog = true;
                    this.update();
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }

}

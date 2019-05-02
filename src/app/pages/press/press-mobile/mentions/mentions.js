import {Controller} from 'superb.js';
import {description as template} from './mentions.html';
import HeadlinePaginator from '~/components/headline-paginator/headline-paginator';
import PressExcerpt from '../../press-excerpt/press-excerpt';

export default class Mentions extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['mentions']
        };
    }

    onLoaded() {
        const props = this.getProps();

        this.regions.self.append(new HeadlinePaginator(() => ({
            contents: props.newsMentions.map((m) => new PressExcerpt(m))
        })));
    }

}

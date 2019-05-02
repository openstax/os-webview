import {Controller} from 'superb.js';
import {description as template} from './releases.html';
import HeadlinePaginator from '~/components/headline-paginator/headline-paginator';
import PressExcerpt from '../../press-excerpt/press-excerpt';

export default class Releases extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['releases']
        };
    }

    onLoaded() {
        const props = this.getProps();
        const noExcerpts = props.pressReleases.map((r) => {
            const result = Object.assign({}, r);

            delete result.excerpt;
            return new PressExcerpt(result);
        });
        const prPaginator = new HeadlinePaginator(() => ({contents: noExcerpts}));

        this.regions.self.append(prPaginator);
    }

}

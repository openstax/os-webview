import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './headline-paginator.html';

export default class HeadlinePaginator extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['headline-paginator']
        };
        this.css = `/app/components/headline-paginator/headline-paginator.css?${VERSION}`;
        this.regions = {
            headlines: '.headlines'
        };
        this.model = () => this.getModel();
        this.pageNumber = 0;
        this.lastPage = 0;
    }

    buttonIf(condition) {
        return condition ? 'button' : 'presentation';
    }

    getModel() {
        this.props = this.getProps();
        console.debug("Got props?", this.props);

        return {
            newerRole: this.buttonIf(this.pageNumber > 0),
            olderRole: this.buttonIf(this.pageNumber < this.lastPage)
        };
    }

    onLoaded() {
        this.regions.headlines.append(this.props.content);
    }

}

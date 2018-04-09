import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './toc-pane.html';

export default class TocPane extends Controller {

    init(props) {
        this.template = template;
        this.props = props;
        this.view = {
            classes: ['toc-pane']
        };
        this.regions = {
            toc: '.toc-region'
        };
        this.css = `/app/pages/details-new/phone-view/toc-pane/toc-pane.css?${VERSION}`;
        this.model = () => this.getModel();
    }

    // Returns a dictionary of values to be used in the template
    // Refreshes props, to ensure they're up to date
    getModel() {
        return {
            webviewLink: this.props.webviewLink
        };
    }

    onLoaded() {
        this.regions.toc.attach(this.props.contentPane);
    }

}

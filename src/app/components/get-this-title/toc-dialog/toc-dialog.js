import VERSION from '~/version';
import {Controller} from 'superb.js';
import Contents from '~/pages/details/contents/contents';
import {description as template} from './toc-dialog.html';

export default class TocDialog extends Controller {

    init(props) {
        this.template = template;
        this.props = props;
        this.model = {
            webviewLink: props.webviewLink
        };
        this.view = {
            tag: 'toc-dialog'
        };
        this.css = `/app/components/get-this-title/toc-dialog/toc-dialog.css?${VERSION}`;
        this.regions = {
            toc: '.toc-region'
        };
    }

    onLoaded() {
        this.regions.toc.attach(
            new Contents(this.props.tableOfContents, {tag: 'ol', classes: ['table-of-contents']})
        );
    }

}

import VERSION from '~/version';
import {Controller} from 'superb.js';
import Contents from '~/pages/details/contents/contents';
import {description as template} from './toc-dialog.html';

export default class TocDialog extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            tag: 'toc-dialog'
        };
        this.css = `/app/components/get-this-title-new/toc-dialog/toc-dialog.css?${VERSION}`;
        this.regions = {
            toc: '.toc-region'
        };
    }

    onLoaded() {
        this.regions.toc.attach(
            new Contents(this.model.tableOfContents, {tag: 'ol', classes: ['table-of-contents']})
        );
    }

}

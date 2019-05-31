import {Controller} from 'superb.js';
import Contents from '~/pages/details/contents/contents';
import {description as template} from './toc-dialog.html';
import css from './toc-dialog.css';

export default class TocDialog extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            tag: 'toc-dialog'
        };
        this.css = css;
        this.regions = {
            toc: '.toc-region'
        };
    }

    onLoaded() {
        if (this.model.tableOfContents) {
            this.regions.toc.attach(
                new Contents(this.model.tableOfContents, {tag: 'ol', classes: ['table-of-contents']})
            );
        }
    }

}

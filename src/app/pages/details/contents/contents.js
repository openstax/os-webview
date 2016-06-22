import {Controller} from 'superb';
import {description as template} from './contents.html';

export default class ContentEntry extends Controller {

    init(data) {
        this.template = template;
        this.regions = {
            subunit: '.subunit'
        };
        this.templateHelpers = data; // FIX: This is what models are for
    }

    onLoaded() {
        if (this.templateHelpers.contents) {
            for (const entry of this.templateHelpers.contents) {
                this.regions.subunit.appendAs('li', new ContentEntry(entry));
            }
        }
    }

}

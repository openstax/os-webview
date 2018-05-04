import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './let-us-know.html';
import {description as templatePolish} from './let-us-know-polish.html';

export default class LetUsKnow extends Controller {

    init(getProps) {
        this.model = getProps();
        const polish = (/^Fizyka/).test(this.model.title);

        this.template = polish ? templatePolish : template;
        this.view = {
            classes: ['let-us-know']
        };
        this.css = `/app/pages/details/let-us-know/let-us-know.css?${VERSION}`;
    }

}

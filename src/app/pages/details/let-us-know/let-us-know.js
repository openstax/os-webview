import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './let-us-know.html';

export default class LetUsKnow extends Controller {

    init(getProps) {
        this.model = getProps();
        this.template = template;
        this.view = {
            classes: ['let-us-know']
        };
        this.css = `/app/pages/details/let-us-know/let-us-know.css?${VERSION}`;
    }

}

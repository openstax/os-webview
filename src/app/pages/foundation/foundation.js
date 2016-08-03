import {Controller} from 'superb';
import {description as template} from './foundation.html';

export default class Foundation extends Controller {

    static description = 'OpenStax is supported by our philanthropic ' +
        'sponsors like the Bill & Melinda Gates Foundation, the William and Flora ' +
        'Hewlett Foundation, and more.';

    init() {
        document.querySelector('head meta[name="description"]').content = Foundation.description;
        this.template = template;
        this.css = '/app/pages/foundation/foundation.css';
        this.view = {
            classes: ['foundation-page', 'page']
        };
    }

}

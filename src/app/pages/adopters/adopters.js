import settings from 'settings';
import {Controller} from 'superb';
import {description as template} from './adopters.html';

export default class Adopters extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/adopters/adopters.css';
        this.view = {
            classes: ['adopters-page', 'text-content']
        };
        this.model = [];

        fetch(`${settings.apiOrigin}/api/adopters`)
        .then((response) => response.json())
        .then((json) => {
            this.model = json;
            this.update();
        });
    }

}

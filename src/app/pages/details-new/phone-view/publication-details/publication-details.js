import {Controller} from 'superb.js';
import {description as template} from './publication-details.html';

export default class PublicationDetails extends Controller {

    init(model) {
        this.model = model;
        this.template = template;
    }

}

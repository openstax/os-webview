import {Controller} from 'superb.js';
import {description as template} from './author-list.html';

export default class AuthorList extends Controller {

    init(model) {
        this.model = model;
        this.template = template;
    }

}

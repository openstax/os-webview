import {Controller} from 'superb.js';
import {description as template} from './author-list.html';
import {description as templatePolish} from './author-list-polish.html';

export default class AuthorList extends Controller {

    init(model) {
        this.model = model;
        this.template = this.model.polish ? templatePolish : template;
    }

}

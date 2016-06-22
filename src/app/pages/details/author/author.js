import {Controller} from 'superb';
import {description as template} from './author.html';

export default class Author extends Controller {

    init(data) {
        this.template = template;
        this.templateHelpers = data; // FIX: This is what models are for
    }

}

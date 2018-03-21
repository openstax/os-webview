import {Controller} from 'superb.js';
import {description as template} from './program-details.html';

export default class ProgramDetails extends Controller {

    init() {
        this.template = template;
        // For specifying the tag (default div) and classes of the container element
        this.view = {
            classes: ['program-details']
        };
    }

}

import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './publication-details.html';
import {description as templatePolish} from './publication-details-polish.html';

export default class PublicationDetails extends Controller {

    init(model, polish) {
        this.model = model;
        this.template = polish ? templatePolish : template;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}

import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import {description as template} from './details-tab.html';

export default class DetailsTab extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['details-tab']
        };
        this.css = `/app/pages/details-new/details-tab/details-tab.css?${VERSION}`;
        this.regions = {
            getTheBook: '.get-the-book'
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        this.regions.getTheBook.append(new GetThisTitle(this.model.bookInfo));
    }

}

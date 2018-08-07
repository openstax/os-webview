import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import LetUsKnow from '../let-us-know/let-us-know';
import {description as template} from './details-tab.html';
import {description as templatePolish} from './details-tab-polish.html';

export default class DetailsTab extends Controller {

    init(model) {
        this.template = model.polish ? templatePolish : template;
        this.model = model;
        this.view = {
            classes: ['details-tab']
        };
        this.css = `/app/pages/details/details-tab/details-tab.css?${VERSION}`;
        this.regions = {
            getTheBook: '.get-the-book',
            letUsKnow: '.let-us-know-region'
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        if (!this.model.comingSoon) {
            this.regions.getTheBook.append(
                new GetThisTitle(
                    Object.assign({includeTOC: true}, this.model.bookInfo)
                )
            );
        }

        if ($.isPolish(this.model.title)) {
            this.regions.letUsKnow.append(new LetUsKnow(() => ({
                title: this.model.title
            })));
        } else if (this.model.salesforceAbbreviation) {
            this.regions.letUsKnow.append(new LetUsKnow(() => ({
                title: this.model.salesforceAbbreviation
            })));
        }
    }

}

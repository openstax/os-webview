import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import AuthorList from '~/pages/details/phone-view/author-list/author-list';
import PublicationDetails from '~/pages/details/phone-view/publication-details/publication-details';
import CollapsingPane from '~/components/collapsing-pane/collapsing-pane';
import {description as template} from './details-pane.html';

export default class DetailsPane extends Controller {

    init(model) {
        this.model = model;
        this.template = template;
        this.view = {
            classes: ['details-pane']
        };
        this.css = `/app/pages/details/phone-view/details-pane/details-pane.css?${VERSION}`;
        this.regions = {
            authors: '.authors-region',
            productDetails: '.product-details-region'
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        const authorComponent = new AuthorList({
            allSenior: this.model.allSenior,
            allNonsenior: this.model.allNonsenior
        });
        const publicationComponent = new PublicationDetails(this.model);

        this.regions.authors.attach(new CollapsingPane({
            title: 'Authors',
            contentComponent: authorComponent
        }));
        this.regions.productDetails.attach(new CollapsingPane({
            title: 'Product details',
            contentComponent: publicationComponent
        }));
    }

}

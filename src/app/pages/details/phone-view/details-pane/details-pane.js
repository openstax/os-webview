import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import AuthorList from '~/pages/details/phone-view/author-list/author-list';
import PublicationDetails from '~/pages/details/phone-view/publication-details/publication-details';
import CollapsingPane from '~/components/collapsing-pane/collapsing-pane';
import {description as template} from './details-pane.html';
import css from './details-pane.css';

export default class DetailsPane extends Controller {

    init(model) {
        this.model = model;
        this.template = template;
        this.view = {
            classes: ['details-pane']
        };
        this.css = css;
        this.regions = {
            authors: '.authors-region',
            productDetails: '.product-details-region'
        };
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        const polish = $.isPolish(this.model.title);
        const authorComponent = new AuthorList({
            polish,
            allSenior: this.model.allSenior,
            allNonsenior: this.model.allNonsenior
        });
        const publicationComponent = new PublicationDetails(this.model, polish);

        this.regions.authors.attach(new CollapsingPane({
            title: polish ? 'Autorzy' : 'Authors',
            contentComponent: authorComponent
        }));
        this.regions.productDetails.attach(new CollapsingPane({
            title: polish ? 'Szczegóły Produktu' : 'Product details',
            contentComponent: publicationComponent
        }));
    }

}

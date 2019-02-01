import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import {makeDocModel} from '~/models/usermodel';
import {description as template} from './institutional-partners.html';
import css from './institutional-partners.css';

const spec = {
    template,
    css,
    view: {
        classes: ['impact-page', 'page']
    },
    model: {},
    slug: 'pages/impact'
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class InstitutionalPartners extends BaseClass {

    onDataLoaded() {
        this.model = this.pageData;
        this.update();
        this.insertHtml();

        const row1 = this.model.row_1[0];

        if (row1.document) {
            makeDocModel(row1.document).load().then((data) => {
                row1.link = data.file;
                this.update();
            });
        }
    }

}

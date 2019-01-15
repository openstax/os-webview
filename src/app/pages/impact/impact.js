import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import {makeDocModel} from '~/models/usermodel';
import {description as template} from './impact.html';
import css from './impact.css';

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

export default class Impact extends BaseClass {

    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

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

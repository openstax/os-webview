import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './detail.html';
import css from './detail.css';

const spec = {
    template,
    css,
    view: {
        classes: ['errata-detail-block']
    },
    model: {
        detailDataPairs: [
            ['Submission ID', 'id'],
            ['Title', 'bookTitle'],
            ['Source', 'source'],
            ['Status', 'status'],
            ['Error Type', 'errorType'],
            ['Location', 'location'],
            ['Description', 'detail'],
            ['Date Submitted', 'date']
        ],
        decisionDataPairs: [
            ['Decision', 'status'],
            ['Decision details', 'resolutionNotes']
        ]
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    init(props) {
        super.init();
        Object.assign(this.model, props);
    }

}

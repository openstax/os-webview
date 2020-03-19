import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './detail.html';
import css from './detail.css';

const spec = {
    template,
    css,
    view: {
        classes: ['errata-detail-block']
    },
    model() {
        return {
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
                ['Decision', 'resolutionNotes']
            ],
            showDecisionDetails: this.showDecisionDetails,
            detail: this.detail
        };
    }
};

export default componentType(spec, insertHtmlMixin);

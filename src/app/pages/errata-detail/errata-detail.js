import componentType, {loaderMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './errata-detail.html';
import css from './errata-detail.css';
import bookPromise from '~/models/book-titles';
import Detail from './detail/detail';
import ProgressBar from './progress-bar/progress-bar';

function localizedDate(dateStr) {
    if (dateStr) {
        return new Date(dateStr).toLocaleDateString();
    }
    return '';
}

// eslint-disable-next-line complexity
function reviewStatus(detail) {
    const result = {
        status: 'Reviewed',
        barStatus: ''
    };

    if (['New', 'Editorial Review'].includes(detail.status)) {
        result.status = 'In Review';
    } else if (detail.resolution === 'Approved') {
        if (detail.status === 'Completed') {
            result.status = `Corrected ${localizedDate(detail.modified)} in web view`;
            result.barStatus = 'Corrected';
        } else {
            result.status = 'Will Correct';
        }
    } else if (detail.status === 'Completed' && detail.resolution === 'Duplicate') {
        result.status = result.barStatus = 'Duplicate';
    } else {
        result.status = result.barStatus = 'No Correction';
    }

    return result;
}

export function detailModelPromise(detail) {
    const {status, barStatus} = reviewStatus(detail);

    return bookPromise.then((bookList) => {
        const entry = bookList.find((info) => info.id === detail.book);

        return {
            showDecisionDetails: barStatus || status === 'Will Correct',
            detail: {
                id: detail.id,
                bookTitle: entry.title,
                source: detail.resource === 'Other' ? detail.resource_other : detail.resource,
                status,
                errorType: detail.error_type,
                location: detail.location,
                detail: detail.detail,
                date: new Date(detail.created).toLocaleDateString(),
                resolutionNotes: detail.resolution_notes
            }
        };
    });
}

const spec = {
    template,
    slug: 'set in init',
    view: {
        classes: ['errata-detail', 'page']
    },
    regions: {
        children: '.boxed'
    }
};

export default class extends componentType(spec, loaderMixin) {

    init() {
        super.init();
        this.slug = location.pathname.substr(1);
    }

    onDataLoaded() {
        const detail = this.pageData;

        if (detail.created) {
            const {status, barStatus} = reviewStatus(detail);
            const progressBar = new ProgressBar({
                status,
                barStatus,
                createdDate: localizedDate(detail.created),
                reviewedDate: localizedDate(detail.reviewed_date),
                correctedDate: localizedDate(detail.corrected_date)
            });

            detailModelPromise(detail).then((detailModel) => {
                const detailSection = new Detail(detailModel);

                this.hideLoader();

                this.regions.children.attach(progressBar);
                this.regions.children.append(detailSection);
            });
        } else {
            window.location = '/404';
        }
    }

};

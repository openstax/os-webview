import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './errata-detail.html';
import css from './errata-detail.css';
import bookPromise from '~/models/book-titles';
import {getDisplayStatus} from '~/helpers/errata';
import Detail from './detail/detail';
import ProgressBar from './progress-bar/progress-bar';

function localizedDate(dateStr) {
    if (dateStr) {
        const d = new Date(dateStr);
        const off = d.getTimezoneOffset();

        d.setMinutes(d.getMinutes() + off);
        return d.toLocaleDateString();
    }
    return '';
}

export function detailModelPromise(detail) {
    const {status, barStatus} = getDisplayStatus(detail);

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

export default class extends componentType(spec) {

    init() {
        super.init();
        this.slug = location.pathname.substr(1);
    }

    onDataLoaded() {
        const detail = this.pageData;

        if (detail.created) {
            const {status, barStatus} = getDisplayStatus(detail);
            const progressBar = new ProgressBar({
                status,
                barStatus,
                createdDate: localizedDate(detail.created),
                reviewedDate: localizedDate(detail.reviewed_date),
                correctedDate: localizedDate(detail.corrected_date)
            });

            detailModelPromise(detail).then((detailModel) => {
                const detailSection = new Detail(detailModel);

                this.regions.children.attach(progressBar);
                this.regions.children.append(detailSection);
            });
        } else {
            window.location = '/404';
        }
    }

};

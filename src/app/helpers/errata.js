import bookPromise from '~/models/book-titles';

// eslint-disable-next-line complexity
export function approvedStatuses(created) {
    const posted = new Date(created);
    const m = posted.getMonth();
    const y = posted.getFullYear();
    const correctionYear = m < 2 ? y : y + 1;
    const postedSpring = m > 10 || m < 2;
    const correctionSeason = `${postedSpring ? 'Fall' : 'Spring'} ${correctionYear}`;
    const correctionDate = new Date(`${correctionYear}/${postedSpring ? 11 : 3}/1`);
    const barStatus = Date.now() > correctionDate ? 'Corrected' : 'Will correct';

    return {
        status: `${barStatus} ${correctionSeason}`,
        barStatus
    };
}

// eslint-disable-next-line complexity
export function getDisplayStatus(detail) {
    const result = {
        status: 'Reviewed',
        barStatus: ''
    };

    if (detail.status.match(/New|Editorial Review/)) {
        result.status = 'In Review';
    } else if (detail.resolution === 'Approved') {
        Object.assign(result, approvedStatuses(detail.created));
    } else if (detail.status === 'Completed' && detail.resolution === 'Duplicate') {
        result.status = result.barStatus = 'Duplicate';
    } else {
        result.status = result.barStatus = 'No Correction';
    }

    return result;
}

export function getDetailModel(detail) {
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

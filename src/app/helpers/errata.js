import React, {useState, useEffect} from 'react';
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
export function getDisplayStatus(data) {
    const result = {
        status: 'Reviewed',
        barStatus: ''
    };

    if (!data) {
        return result;
    }
    if (data.status.match(/New|Editorial Review/)) {
        result.status = 'In Review';
    } else if (data.resolution === 'Approved') {
        Object.assign(result, approvedStatuses(data.created));
    } else if (data.status === 'Completed' && data.resolution === 'Duplicate') {
        result.status = result.barStatus = 'Duplicate';
    } else {
        result.status = result.barStatus = 'No Correction';
    }

    return result;
}

export function shouldShowDecisionDetails(data) {
    const {status, barStatus} = getDisplayStatus(data);

    return barStatus || status === 'Will Correct';
}

export function useErrataDetail(data) {
    const [detail, setDetail] = useState();

    useEffect(() => {
        bookPromise.then((bookList) => {
            if (!data) {
                return;
            }
            const entry = bookList.find((info) => info.id === data.book);
            const location = [data.location, data.additionalLocationInformation]
                .filter((info) => info).join('; ');

            setDetail({
                id: data.id,
                bookTitle: entry.title,
                source: data.resource === 'Other' ? data.resourceOther : data.resource,
                status,
                errorType: data.errorType,
                location,
                detail: data.detail,
                date: new Date(data.created).toLocaleDateString(),
                resolutionNotes: data.resolutionNotes
            });
        });
    }, [data]);

    return detail;
}

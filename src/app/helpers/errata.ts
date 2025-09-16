import {useState, useEffect} from 'react';
import bookPromise, {Item} from '~/models/book-titles';

export type Errata = {
    id: string;
    status: string;
    resolution: string;
    reviewedDate: string | null;
    correctedDate: string | null;
    created: string;
    modified: string;
    book: Item['id'];
    location?: string;
    additionalLocationInformation?: string;
    resource: string;
    resourceOther: string;
    errorType: string;
    errorTypeOther?: string;
    detail: string;
    resolutionNotes: string;
};

export type Detail = Pick<
    Errata,
    'id' | 'status' | 'errorType' | 'detail' | 'resolutionNotes'
> & {
    bookTitle: Item['title'];
    source: string;
    location: string;
    date: string;
};

export function approvedStatuses(created: string, corrected: string | null) {
    const posted = new Date(created);
    const m = posted.getMonth();
    const y = posted.getFullYear();
    const correctionYear = m < 2 ? y : y + 1;
    const postedSpring = m > 10 || m < 2;
    const correctionSeason = corrected
        ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short'
          }).format(new Date(corrected))
        : `${postedSpring ? 'Fall' : 'Spring'} ${correctionYear}`;
    const barStatus = corrected ? 'Corrected' : 'Will correct';

    return {
        status: `${barStatus} ${correctionSeason}`,
        barStatus
    };
}

export type DisplayStatusValue = 'Reviewed' | 'In Review' | 'Duplicate' | 'No Correction' | 'Will Correct';

export function getDisplayStatus(data?: Errata) {
    const result = {
        status: 'Reviewed' as DisplayStatusValue,
        barStatus: ''
    };

    if (!data) {
        return result;
    }
    if (data.status.match(/New|Editorial Review/)) {
        result.status = 'In Review';
    } else if (data.resolution === 'Approved') {
        Object.assign(
            result,
            approvedStatuses(data.created, data.correctedDate)
        );
    } else if (data.status === 'Completed' && data.resolution === 'Duplicate') {
        result.status = result.barStatus = 'Duplicate';
    } else {
        result.status = result.barStatus = 'No Correction';
    }

    return result;
}

export function shouldShowDecisionDetails(data: Errata) {
    const {status, barStatus} = getDisplayStatus(data);

    return barStatus || status === 'Will Correct';
}

export function useErrataDetail(data = {} as Errata) {
    const [detail, setDetail] = useState<Detail>();

    useEffect(() => {
        bookPromise.then((bookList) => {
            if (!data.id) {
                return;
            }
            const entry = bookList.find((info) => info.id === data.book);
            const location = [data.location, data.additionalLocationInformation]
                .filter((info) => info)
                .join('; ');
            const source =
                data.resource === 'Other' ? data.resourceOther : data.resource;

            setDetail({
                id: data.id,
                status: data.status,
                bookTitle: entry?.title ?? '',
                source,
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

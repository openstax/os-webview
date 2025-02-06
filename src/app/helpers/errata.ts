import {useState, useEffect} from 'react';
import bookPromise, {Item} from '~/models/book-titles';

export type Errata = {
    id: number;
    status: string;
    resolution: string;
    created: string;
    book: Item['id'];
    location?: string;
    additionalLocationInformation?: string;
    resource: string;
    resourceOther: string;
    errorType: unknown;
    detail: unknown;
    resolutionNotes: string;
};

type Detail = Pick<
    Errata,
    'id' | 'status' | 'errorType' | 'detail' | 'resolutionNotes'
> & {
    bookTitle: Item['title'];
    source: string;
    location: string;
    date: string;
};


export function approvedStatuses(created: string) {
    const posted = new Date(created);
    const m = posted.getMonth();
    const y = posted.getFullYear();
    const correctionYear = m < 2 ? y : y + 1;
    const postedSpring = m > 10 || m < 2;
    const correctionSeason = `${
        postedSpring ? 'Fall' : 'Spring'
    } ${correctionYear}`;
    const correctionDate = new Date(
        `${correctionYear}/${postedSpring ? 11 : 3}/1`
    );
    const barStatus =
        Date.now() > correctionDate.getTime() ? 'Corrected' : 'Will correct';

    return {
        status: `${barStatus} ${correctionSeason}`,
        barStatus
    };
}


export function getDisplayStatus(data?: Errata) {
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
            const source = data.resource === 'Other'
                ? data.resourceOther
                : data.resource;

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

import React from 'react';
import sfApiFetch from '~/models/sfapi';
import {usePromise} from '~/helpers/use-data';

export type BookImpact = {adoptions: number; savings: number};
type ImpactResponse = {books?: Partial<BookImpact>[]} | null;

function toBookImpact(response: ImpactResponse): BookImpact | undefined {
    const {adoptions, savings} = response?.books?.[0] ?? {};

    return adoptions && savings !== undefined ? {adoptions, savings} : undefined;
}

async function fetchBookImpact(
    salesforceName?: string
): Promise<BookImpact | undefined> {
    if (!salesforceName) {
        return undefined;
    }
    const response: ImpactResponse = await sfApiFetch(
        'impact',
        `/books?name=${encodeURIComponent(salesforceName)}`
    );

    return toBookImpact(response);
}

type TaggedImpact = {name?: string; impact?: BookImpact};

// The result carries the name it was fetched for, so a page that navigates to
// another book shows nothing instead of the previous book's numbers while the
// new request is in flight.
export default function useBookImpact(salesforceName?: string) {
    const promise = React.useMemo(
        () =>
            fetchBookImpact(salesforceName).then(
                (impact): TaggedImpact => ({name: salesforceName, impact})
            ),
        [salesforceName]
    );
    const result = usePromise<TaggedImpact>(promise, {});

    return result.name === salesforceName ? result.impact : undefined;
}

import React from 'react';
import {useDataFromSlug} from '~/helpers/page-data-utils';

export default function useDonationPopupData() {
    const data1 = useDataFromSlug('donations/donation-popup');
    const data = React.useMemo(
        () => (data1?.length > 0 ? data1[0] : {}),
        [data1]
    );

    return data;
}

export type DonationPopupData = ReturnType<typeof useDonationPopupData>;

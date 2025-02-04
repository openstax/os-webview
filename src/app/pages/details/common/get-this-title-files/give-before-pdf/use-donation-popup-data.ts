import React from 'react';
import {useDataFromSlug} from '~/helpers/page-data-utils';

export type DonationPopupData = {
    download_image: string;
    download_ready?: string;
    header_image: string;
    header_title: string;
    header_subtitle: string;
    give_link_text: string;
    give_link: string;
    thank_you_link_text: string;
    thank_you_link: string;
    giving_optional: string;
    go_to_pdf_link_text: string;
    hide_donation_popup: boolean;
};

export default function useDonationPopupData() {
    // When useDataFromSlug moves to TS, we can make it type-generic
    const data1 = useDataFromSlug<DonationPopupData[]>(
        'donations/donation-popup'
    );
    const data = React.useMemo(
        () => (data1 instanceof Array && data1.length > 0 ? data1[0] : {}),
        [data1]
    );

    return data as DonationPopupData;
}

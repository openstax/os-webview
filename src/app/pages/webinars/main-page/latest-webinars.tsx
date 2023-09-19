import React from 'react';
import useWebinarContext from '../webinar-context';
import WebinarGridSection from '../webinar-cards/webinar-grid-section';

export default function LatestWebinars({limit = 3}) {
    const {latestWebinars} = useWebinarContext();

    return (
        <WebinarGridSection
            heading='Latest webinars'
            limit={limit}
            webinars={latestWebinars}
        >
            <a
                className='btn primary'
                href='/webinars/latest'
                data-analytics-link='webinars_latest'
            >
                View more of the latest
            </a>
        </WebinarGridSection>
    );
}

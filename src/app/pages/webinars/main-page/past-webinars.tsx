import React from 'react';
import useWebinarContext from '../webinar-context';
import WebinarGridSection from '../webinar-cards/webinar-grid-section';
import {RetraceableLink} from '~/components/breadcrumb/breadcrumb';

export default function LatestWebinars({filter = () => true, limit = 3}) {
    const {past} = useWebinarContext();

    return (
        <WebinarGridSection
            heading='Past webinars'
            filter={filter}
            limit={limit}
            webinars={past}
        >
            <RetraceableLink
                className='btn primary'
                to='/webinars/past'
                data-analytics-link='webinars_past'
            >
                View all past webinars
            </RetraceableLink>
        </WebinarGridSection>
    );
}

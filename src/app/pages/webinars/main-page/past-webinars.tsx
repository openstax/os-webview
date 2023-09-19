import React from 'react';
import useWebinarContext from '../webinar-context';
import WebinarGridSection from '../webinar-cards/webinar-grid-section';
import {RetraceableLink} from '~/components/breadcrumb/breadcrumb';

export default function PastWebinars() {
    const {past} = useWebinarContext();

    return (
        <WebinarGridSection
            heading='Past webinars'
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

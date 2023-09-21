import React from 'react';
import useWebinarContext from '../webinar-context';
import WebinarGridSection from '../webinar-cards/webinar-grid-section';
import {RetraceableLink} from '~/components/breadcrumb/breadcrumb';

export default function UpcomingWebinars() {
    const {upcoming} = useWebinarContext();

    return (
        <WebinarGridSection
            heading='Upcoming webinars'
            webinars={upcoming}
        >
            <RetraceableLink
                className='btn primary'
                to='/webinars/upcoming'
                data-analytics-link='webinars_upcoming'
            >
                View all upcoming webinars
            </RetraceableLink>
        </WebinarGridSection>
    );
}

import React from 'react';
import useWebinarContext from '../webinar-context';
import usePortalContext from '~/contexts/portal';
import WebinarGridSection from '../webinar-cards/webinar-grid-section';
import {RetraceableLink} from '~/components/breadcrumb/breadcrumb';

export default function UpcomingWebinars() {
    const {upcoming} = useWebinarContext();
    const {linkPrefix} = usePortalContext();

    return (
        <WebinarGridSection
            heading='Upcoming webinars'
            webinars={upcoming}
        >
            <RetraceableLink
                className='btn primary'
                to={`${linkPrefix}/webinars/upcoming`}
                data-analytics-link='webinars_upcoming'
            >
                View all upcoming webinars
            </RetraceableLink>
        </WebinarGridSection>
    );
}

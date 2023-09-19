import React from 'react';
import useWebinarContext from '../webinar-context';
import ViewWebinarsPage from './view-webinars-page';

export default function UpcomingPage() {
    const {latestWebinars} = useWebinarContext();

    return (
        <ViewWebinarsPage heading='Latest webinars' webinars={latestWebinars} />
    );
}

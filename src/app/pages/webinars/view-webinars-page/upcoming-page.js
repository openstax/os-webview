import React from 'react';
import useWebinarContext from '../webinar-context';
import ViewWebinarsPage from './view-webinars-page';

export default function UpcomingPage() {
    const {upcoming} = useWebinarContext();

    return (
        <ViewWebinarsPage heading='Upcoming webinars' webinars={upcoming} />
    );
}

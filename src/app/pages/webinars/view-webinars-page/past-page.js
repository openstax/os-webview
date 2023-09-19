import React from 'react';
import useWebinarContext from '../webinar-context';
import ViewWebinarsPage from './view-webinars-page';

export default function UpcomingPage() {
    const {past} = useWebinarContext();

    return (
        <ViewWebinarsPage heading='Past webinars' webinars={past} />
    );
}

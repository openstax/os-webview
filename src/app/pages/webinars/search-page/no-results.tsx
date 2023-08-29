import React from 'react';
import LatestWebinars from '../webinar-cards/latest-webinars';
import './no-results.scss';

export default function NoResults() {
    return (
        <div className='boxed left no-results'>
            <div>
                <h1>No matching webinars found</h1>
                <div>Our latest webinars are below.</div>
            </div>
            <LatestWebinars limit={6} />
        </div>
    );
}

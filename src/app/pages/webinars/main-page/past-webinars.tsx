import React from 'react';
import useWebinarContext from '../webinar-context';
import PaginatedWebinarGrid from '../webinar-cards/paginated-webinar-grid';

export default function PastWebinars() {
    const {past} = useWebinarContext();

    return (
        <section className='webinar-grid-section'>
            <h2>Past webinars</h2>
            <PaginatedWebinarGrid webinars={past} />
        </section>
    );
}

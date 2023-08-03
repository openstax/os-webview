// Has to remain JS so it can be dynamically imported
import React from 'react';
import useWebinarContext from './webinar-context';

export default function ExplorePage() {
    const {collections} = useWebinarContext();

    console.info('Collections?', collections);

    return (
        <div className='boxed left'>
            <div>Breadcrumb</div>
            <div>Heading and searchbar</div>
            <div>Featured webinar (pin to top?)</div>
            <div>Popular?</div>
            <div>Latest?</div>
        </div>
    );
}

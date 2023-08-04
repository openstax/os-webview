import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Collection} from './types';
import './explore-by-collection.scss';

function CollectionLink({
    collection,
    from
}: {
    collection: Collection;
    from: string;
}) {
    return (
        <Link
            to={`./explore/collection/${collection.name}`}
            state={{from}}
            className='card'
        >
            <div className='centered-image'>
                <img src={collection.collectionImage} alt='' />
            </div>
            <div className='name'>{collection.name}</div>
        </Link>
    );
}

export default function ExploreCollections({
    collections,
    analyticsNav
}: {
    collections: Collection[];
    analyticsNav: string;
}) {
    const {pathname} = useLocation();

    return (
        <section id='explore-collections'>
            <h2>Explore collections</h2>
            <div className='cards' data-analytics-nav={analyticsNav}>
                {collections.map((c) => (
                    <CollectionLink collection={c} key={c.id} from={pathname} />
                ))}
            </div>
        </section>
    );
}

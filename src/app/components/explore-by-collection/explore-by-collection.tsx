import React from 'react';
import {Link} from 'react-router-dom';
import {Collection} from './types';
import './explore-by-collection.scss';

function CollectionLink({collection}: {collection: Collection}) {
    return (
        <Link to={`./explore/collection/${collection.name}`} className='card'>
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
    return (
        <section id='explore-collections'>
            <h2>Explore collections</h2>
            <div className='cards' data-analytics-nav={analyticsNav}>
                {collections.map((c) => (
                    <CollectionLink collection={c} key={c.id} />
                ))}
            </div>
        </section>
    );
}

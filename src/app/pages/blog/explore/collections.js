import React from 'react';
import useBlogContext from '../blog-context';
import {Link} from 'react-router-dom';
import './collections.scss';

function CollectionLink({data}) {
    return (
        <Link to={`/blog/explore/${data.name}`} className="card">
            <div className="centered-image">
                <img src={data.collectionImage} alt="" />
            </div>
            <div className="name">{data.name}</div>
        </Link>
    );
}

export default function ExploreCollections() {
    const {collectionSnippet: collections} = useBlogContext();

    return (
        <section id="explore-collections">
            <h2>Explore collections</h2>
            <div className="cards">
                {
                    collections.map(
                        (c) => <CollectionLink data={c} key={c.id} />
                    )
                }
            </div>
        </section>
    );
}

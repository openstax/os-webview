import React from 'react';
import usePageContext from '../page-context';
import './featured-in.scss';

export default function FeaturedIn() {
    const {featuredIn} = usePageContext();

    return (
        <div className='content-block'>
            <h2>Featured in</h2>
            <div className='link-grid'>
                {featuredIn.map((obj) => (
                    <a key={obj.image} href={obj.url}>
                        <img src={obj.image} alt={obj.name} />
                    </a>
                ))}
            </div>
        </div>
    );
}

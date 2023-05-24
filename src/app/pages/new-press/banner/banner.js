import React from 'react';
import usePageContext from '../page-context';
import './banner.scss';

export default function Banner() {
    const {headline} = usePageContext();

    return (
        <div className='content-block'>
            <div className='hero'>
                <h1>{headline}</h1>
            </div>
        </div>
    );
}

import React from 'react';
import usePageContext from '../page-context';
import './banner.scss';

export default function Banner() {
    const {title} = usePageContext();

    return (
        <div className='content-block'>
            <div className='hero'>
                <h1>{title}</h1>
            </div>
        </div>
    );
}

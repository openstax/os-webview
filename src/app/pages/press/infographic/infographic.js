import React from 'react';
import usePageContext from '../page-context';

export default function Infographic() {
    const {infographicText, infographicImage} = usePageContext();

    return (
        <div className='content-block'>
            <h2>{infographicText}</h2>
            <img
                src={infographicImage.meta.downloadUrl}
                alt={infographicImage.title}
            />
        </div>
    );
}

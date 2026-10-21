import React from 'react';
import usePortalContext from '~/contexts/portal';
import './map.scss';

export default function Map({
    title,
    buttonText,
    imageUrl
}: {
    title: string;
    buttonText: string;
    imageUrl: string;
}) {
    const {portalPrefix} = usePortalContext();

    return (
        <div className="mapbox">
            <div
                className="map-image"
                style={{backgroundImage: `url(${imageUrl})`}}
            ></div>
            <div className="overlay">
                <div className="boxed">
                    <h1>{title}</h1>
                    <a href={`${portalPrefix}/separatemap`} className="btn primary">
                        {buttonText}
                    </a>
                </div>
            </div>
        </div>
    );
}

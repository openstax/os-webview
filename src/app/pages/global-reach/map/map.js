import React from 'react';
import './map.scss';

export default function Map({title, buttonText, imageUrl}) {
    return (
        <div className="mapbox">
            <div className="map-image" style={{backgroundImage: `url(${imageUrl})`}}></div>
            <div className="overlay">
                <div className="boxed">
                    <h1>{title}</h1>
                    <a href="/separatemap" className="btn primary">
                        {buttonText}
                    </a>
                </div>
            </div>
        </div>
    );
}

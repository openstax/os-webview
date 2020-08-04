import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './schoolmap.css';

export default function SchoolMap({heading, blurb, link: linkUrl, cta: linkText}) {
    return (
        <div className="schoolmapbox">
            <div className="content schoolmapdiv">
                <div className="main-content">
                    <div className="txthead">{heading}</div>
                    <div className="txtbdy">{blurb}</div>
                    <div className="txtlink">
                        <a href={linkUrl}>{linkText}</a>
                        <span className="linkarrow">
                            <FontAwesomeIcon icon="chevron-right" />
                        </span>
                    </div>
                </div>
                <div><img className="map-img" src="/images/home/map2.png" /></div>
            </div>
        </div>
    );
}

import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import './schoolmap.scss';

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
                            <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                    </div>
                </div>
                <div><img className="map-img" src="/images/home/map2.png" /></div>
            </div>
        </div>
    );
}

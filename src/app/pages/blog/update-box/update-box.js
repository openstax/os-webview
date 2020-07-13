import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import settings from 'settings';
import './update-box.css';

const rssUrl = `${settings.apiOrigin}/blog-feed/rss/`;

export default function UpdateBox() {
    return (
        <div className="update-box">
            <h3>Get updates in your inbox.</h3>
            <span className="button-row">
                <a className="btn cta" href="http://www2.openstax.org/l/218812/2016-10-04/lvk">Sign Up</a>
                or RSS
                <a className="rss-link" href={rssUrl}>
                    <FontAwesomeIcon icon="rss-square" />
                </a>
            </span>
        </div>
    );
}

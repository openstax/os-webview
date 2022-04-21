import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRssSquare} from '@fortawesome/free-solid-svg-icons/faRssSquare';
import './update-box.scss';

const rssUrl = `${process.env.API_ORIGIN}/blog-feed/rss/`;

export default function UpdateBox() {
    return (
        <div className="update-box">
            <h3>Get updates in your inbox.</h3>
            <span className="button-row">
                <a className="btn cta" href="http://www2.openstax.org/l/218812/2016-10-04/lvk">Sign Up</a>
                or RSS
                <a className="rss-link" href={rssUrl} aria-label="rss">
                    <FontAwesomeIcon icon={faRssSquare} />
                </a>
            </span>
        </div>
    );
}

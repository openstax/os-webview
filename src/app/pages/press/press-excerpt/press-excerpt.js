import React from 'react';
import Byline from '~/components/byline/byline';
import './press-excerpt.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';

function OptionalExcerpt({excerpt, url}) {
    return (
        excerpt &&
            <div className="excerpt">
                {excerpt}…{' '}
                <a href={url}>Continue reading</a>
            </div>
    );
}

export default function PressExcerpt({iconUrl, author, date, source, url, headline, excerpt}) {
    const classList = ['press-excerpt'];

    if (iconUrl) {
        classList.push('with-icon');
    }

    return (
        <div className={classList.join(' ')}>
            {iconUrl && <img src={iconUrl} alt="" />}
            <Byline author={author} date={date} source={source} />
            <div className="headline">
                <a href={url}>{headline}{' '}
                    {
                        source && <FontAwesomeIcon icon={faExternalLinkAlt} />
                    }
                </a>
            </div>
            <OptionalExcerpt excerpt={excerpt} url={url} />
        </div>
    );
}

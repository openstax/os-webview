import React from 'react';
import Byline from '~/components/byline/byline';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';

export function ContentBlock({title, children}) {
    return (
        <div className='content-block'>
            <h2>{title}</h2>
            {children}
        </div>
    );
}

export function asDate(dateStr) {
    const [year, month, day] = dateStr.split('-');

    return new Date(year, month - 1, day);
}

export function convertedDate(dateStr) {
    return asDate(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function OptionalExcerpt({excerpt, url}) {
    return (
        excerpt && (
            <div className='excerpt'>
                {excerpt}… <a href={url}>Continue reading</a>
            </div>
        )
    );
}

export function PressExcerpt({
    iconUrl,
    author,
    date,
    source,
    url,
    headline,
    excerpt
}) {
    const classList = ['press-excerpt'];

    if (iconUrl) {
        classList.push('with-icon');
    }

    return (
        <div className={classList.join(' ')}>
            {iconUrl && <img src={iconUrl} alt='' />}
            <Byline author={author} date={date} source={source} />
            <div className='headline'>
                <a href={url}>
                    {headline}{' '}
                    {source && <FontAwesomeIcon icon={faExternalLinkAlt} />}
                </a>
            </div>
            <OptionalExcerpt excerpt={excerpt} url={url} />
        </div>
    );
}

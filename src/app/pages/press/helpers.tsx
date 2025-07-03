import React from 'react';
import Byline from '~/components/byline/byline';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';

export function ContentBlock({title, children}: React.PropsWithChildren<{title: string}>) {
    return (
        <div className='content-block'>
            <h2>{title}</h2>
            {children}
        </div>
    );
}

export function asDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-');

    return new Date(+year, +month - 1, +day);
}

export function convertedDate(dateStr: string) {
    return asDate(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function OptionalExcerpt({excerpt, url}: {excerpt?: string; url: string}) {
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
}: Parameters<typeof Byline>[0] & {
    iconUrl?: string;
    url: string;
    headline: string;
    excerpt?: string;
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

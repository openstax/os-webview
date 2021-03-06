import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import './publications-section.scss';

function Publication({pub}) {
    return (
        <div className="publication">
            <div className="headline">
                {pub.authors} ({pub.date}). {pub.title}
            </div>
            <RawHTML html={pub.excerpt} />
            <a href={pub.downloadUrl}>
                View PDF{' '}
                <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
        </div>
    );
}

export default function PublicationsSection({data: {publicationHeader, publications}}) {
    return (
        <section className="publications-section">
            <div className="content">
                <h1>{publicationHeader}</h1>
                {publications.map((pub) => <Publication pub={pub} key={pub.title} />)}
            </div>
        </section>
    );
}

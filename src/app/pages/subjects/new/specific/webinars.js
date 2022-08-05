import React from 'react';
import CarouselSection from './components/carousel-section';
import useSpecificSubjectContext from './context';
import {RawHTML, useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import './webinars.scss';

function Card({
    title='*No title given',
    description,
    registration_url: url,
    registration_link_text: watchText
}) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <RawHTML html={description} />
            <a href={url}>
                {watchText}{' '}
                <FontAwesomeIcon icon={faChevronRight} />
            </a>
        </div>
    );
}

export default function Webinars() {
    const {
        title,
        webinarHeader: {content: {heading, webinarDescription, linkHref, linkText}}
    } = useSpecificSubjectContext();
    const blurbs = useDataFromSlug(`webinars/?subjects=${title}`) || [];

    return (
        blurbs.length ?
            <CarouselSection
                heading={heading}
                description={webinarDescription}
                linkUrl={linkHref} linkText={linkText}
            >
                {blurbs.map((blurb) => <Card {...blurb} key={blurb.link} />)}
            </CarouselSection> :
            <h2>No webinars found (yet)</h2>
    );
}

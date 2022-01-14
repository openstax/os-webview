import React from 'react';
import CarouselSection from './components/carousel-section';
import useSpecificSubjectContext from './context';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import './webinars.scss';


function Card({title='*No title given', description, link: url}) {
    const {webinarSectionWatchText: watchText} = useSpecificSubjectContext();

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

export default function Webinars({subjectName}) {
    const {
        webinarSectionDescription: sectionDescription,
        webinarSectionViewAllUrl: viewAllUrl,
        webinarSectionViewAllText: viewAllText,
        webinarSectionBlurbs: blurbs
    } = useSpecificSubjectContext();

    return (
        <CarouselSection
            id="webinars" className="webinars"
            heading={`Webinars about OpenStax ${subjectName} textbooks`}
            description={sectionDescription}
            linkUrl={viewAllUrl} linkText={viewAllText}
        >
            {blurbs.map((blurb) => <Card {...blurb} key={blurb.link} />)}
        </CarouselSection>
    );
}

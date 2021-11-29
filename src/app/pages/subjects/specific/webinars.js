import React from 'react';
import CarouselSection from './components/carousel-section';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import './webinars.scss';

const sectionDescription = `Learn how our free textbooks are made straight from the
experts. Get tips and tricks for using an OpenStax book from everyday
educators.`;
const viewAllText = 'View all webinars';
const viewAllUrl = '/webinars';
const watchText = 'Click here to watch!';
const blurbs = [
    {
        title: 'Principles of Management author webinar',
        description: `Learn about Principles of Management, our free textbook
        for introductory management courses. This webinar covers strategies for
        teaching with our online textbook and how you can access additional free
        and low-cost resources.`,
        link: 'google1.com'
    },
    {
        title: 'Introduction to Business webinar',
        description: `Learn about Principles of Management, our free textbook
        for introductory management courses. This webinar covers strategies for
        teaching with our online textbook and how you can access additional free
        and low-cost resources.`,
        link: 'google2.com'
    },
    {
        title: 'OpenStax Businss Ethics with author Stephen Byars',
        description: `Learn about Principles of Management, our free textbook
        for introductory management courses. This webinar covers strategies for
        teaching with our online textbook and how you can access additional free
        and low-cost resources.`,
        link: 'google3.com'
    },
    {
        title: 'OpenStax Businss Ethics with author Stephen Byars',
        description: `Learn about Principles of Management, our free textbook
        for introductory management courses. This webinar covers strategies for
        teaching with our online textbook and how you can access additional free
        and low-cost resources.`,
        link: 'google4.com'
    }
];

function Card({title='*No title given', description, link: url}) {
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

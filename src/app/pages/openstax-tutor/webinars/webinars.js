import React, {useState, useRef, useEffect} from 'react';
import {LabeledSection} from '../common';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Carousel from '~/components/carousel/carousel';
import './webinars.css';

function Card({title='*No title given', description, link: url}) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <RawHTML html={description} />
            <a href={url}>
                Watch this webinar&nbsp;
                <FontAwesomeIcon icon="chevron-right" />
            </a>
        </div>
    );
}

export default function Webinars({model: {
    webinarsHeader: headline,
    webinars: blurbs
}}) {
    const headerLabel = 'Webinars';

    // For testing
    // if (blurbs.length < 5) {
    //     blurbs.push(...[1,2,3,4,'last'].map((i) => ({
    //         title: `Card ${i}`
    //     })));
    // }
    //

    return (
        <LabeledSection headerLabel={headerLabel} headline={headline}>
            <div className="webinars carousel">
                <Carousel atATime="3" mobileSlider>
                    {blurbs.map((blurb) => <Card {...blurb} key={blurb.link} />)}
                </Carousel>
            </div>
        </LabeledSection>
    );
}

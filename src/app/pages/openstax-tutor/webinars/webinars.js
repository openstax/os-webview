import React, {useState} from 'react';
import {LabeledSection} from '../common';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
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

    return (
        <LabeledSection headerLabel={headerLabel} headline={headline}>
            <div className="webinars carousel">
                <div className="cards">
                    {blurbs.map((blurb, i) => <Card {...blurb} key={i} />)}
                </div>
            </div>
        </LabeledSection>
    );
}

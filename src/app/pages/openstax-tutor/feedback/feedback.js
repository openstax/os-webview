import React, {useState} from 'react';
import {LabeledSection} from '../common';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './feedback.css';

// TODO: Distinguish video and display correctly
function ImageOrVideo({src}) {
    return (
        <img src={src} />
    );
}

export default function Webinars({model: {
    feedbackImage,
    feedbackHeading: headline,
    feedbackQuote: quote,
    feedbackName: name,
    feedbackOccupation: occupation,
    feedbackOrganization: organization
}}) {
    const headerLabel = 'Feedback';

    return (
        <div className="split-section">
            <ImageOrVideo src={feedbackImage.meta.downloadUrl} />
            <LabeledSection headerLabel={headerLabel} headline={headline}>
                <div className="block-with-a-big-quote">
                    <div className="quote">{quote}</div>
                    <div>&ndash; <b>{name}</b></div>
                    <div>{occupation}</div>
                    <div>{organization}</div>
                </div>
            </LabeledSection>
        </div>
    );
}

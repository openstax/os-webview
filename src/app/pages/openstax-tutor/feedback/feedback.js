import React from 'react';
import {LabeledSection} from '../common';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './feedback.scss';

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
            <ClippedImage
                src={feedbackImage.meta.downloadUrl}
                backgroundPosition="top center"
            />
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

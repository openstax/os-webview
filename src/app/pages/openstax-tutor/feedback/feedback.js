import React from 'react';
import {LabeledSection} from '../common';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './feedback.scss';

export default function Webinars({model: {
    feedbackMedia: [feedbackMedia],
    feedbackHeading: headline,
    feedbackQuote: quote,
    feedbackName: name,
    feedbackOccupation: occupation,
    feedbackOrganization: organization
}}) {
    const headerLabel = 'Feedback';

    return (
        <div className="split-section">
            {
                feedbackMedia.image ?
                    <ClippedImage
                        src={feedbackMedia.image}
                        backgroundPosition="top center"
                    /> :
                    <RawHTML className="feedback-media" embed html={feedbackMedia} />
            }
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

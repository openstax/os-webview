import React from 'react';
import {LabeledSection} from '../common';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './features.scss';

export default function Features({model: {featuresHeader, featuresCards: blurbs}}) {
    const headerLabel = 'Features';

    return (
        <LabeledSection headerLabel={headerLabel} headline={featuresHeader}>
            <div className="features">
                {
                    blurbs.map((blurb) =>
                        <div className="blurb" key={blurb.description}>
                            <img src={blurb.icon.file} />
                            <h2>{blurb.title}</h2>
                            <RawHTML html={blurb.description} />
                        </div>
                    )
                }
            </div>
        </LabeledSection>
    );
}

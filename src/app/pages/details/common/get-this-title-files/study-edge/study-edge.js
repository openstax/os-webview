import React from 'react';
import './study-edge.css';

export default function StudyEdge({model}) {
    const shortName = model.slug.replace('books/', '');
    const googleBadge = '/images/study-edge/google-store-badge.png';
    const googleLink = `https://openstax.studyedge.com/mobile-redirect/android?book=${shortName}`;
    const appleBadge = '/images/study-edge/apple-store-badge.svg';
    const appleLink = `https://openstax.studyedge.com/mobile-redirect/ios?book=${shortName}`;

    return (
        <div className="going-to-study-edge">
            <h1>You are now leaving the OpenStax website.</h1>
            <div className="text-block">
                Get the <b>OpenStax + SE</b> app below.
            </div>
            <div className="button-group">
                <a className="badge" href={appleLink}>
                    <img src={appleBadge} alt="Apple App Store badge" />
                </a>
                <a className="badge" href={googleLink}>
                    <img className="padded" src={googleBadge} alt="Google Play Store badge" />
                </a>
            </div>
        </div>
    );
}

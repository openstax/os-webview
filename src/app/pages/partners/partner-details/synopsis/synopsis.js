import React, {useRef, useContext} from 'react';
import PartnerContext from '../partner-context';
import StarsAndCount from '~/components/stars-and-count/stars-and-count';
import analyticsEvents from '../../analytics-events';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import './synopsis.scss';

function VerifiedBadge({verifiedFeatures}) {
    const badgeImage = '/images/partners/verified-badge.svg';

    return (
        verifiedFeatures &&
            <div className="badge">
                <img className="background" src={badgeImage} alt="verified" />
                <FontAwesomeIcon icon={faCheck} className="checkmark" />
                <div className="tooltip bottom">
                    {verifiedFeatures}
                </div>
            </div>
    );
}

function PartnerLink({partnerUrl, partnerLinkText}) {
    function trackPartnerVisit() {
        analyticsEvents.partnerWebsite(partnerUrl);
    }

    return (
        partnerUrl &&
            <a className="partner-website" href={partnerUrl} onClick={trackPartnerVisit}>
                {partnerLinkText}{' '}
                <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
    );
}

export default function Synopsis({model, icon, partnerLinkProps}) {
    const {verifiedFeatures, tags} = model;
    const ref = useRef();
    const {partnerName, summary: {rating}, reviewCount} = useContext(PartnerContext);

    return (
        <section className="synopsis" ref={ref}>
            <img className="icon" src={icon} alt="" />
            <VerifiedBadge verifiedFeatures={verifiedFeatures} />
            <div className="headline">{partnerName}</div>
            <div className="tags">
                {
                    tags.map((entry) =>
                        <span className="tag" key={entry.value}>
                            {entry.value}
                        </span>
                    )
                }
            </div>
            <StarsAndCount rating={rating} count={reviewCount} showNumber />
            <PartnerLink {...partnerLinkProps} />
        </section>
    );
}

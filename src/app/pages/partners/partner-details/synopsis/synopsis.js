import React, {useEffect, useRef} from 'react';
import StarsAndCount from '~/components/stars-and-count/stars-and-count';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './synopsis.css';

function VerifiedBadge({verifiedFeatures}) {
    const badgeImage = '/images/partners/verified-badge.svg';

    return (
        verifiedFeatures &&
            <div className="badge">
                <img className="background" src={badgeImage} alt="verified" />
                <FontAwesomeIcon icon="check" className="checkmark" />
                <div className="tooltip bottom">
                    {verifiedFeatures}
                </div>
            </div>
    );
}

function logScrollingInParent(el, name) {
    const scrollingRegion = el.parentNode.parentNode;
    const removeScrollListener = (callback) => scrollingRegion.removeEventListener('scroll', callback);
    const scrollCallback = (event) => {
        analyticsEvents.lightboxScroll(name);
        removeScrollListener(scrollCallback);
    };

    scrollingRegion.addEventListener('scroll', scrollCallback);

    return () => removeScrollListener(scrollCallback);
}

function PartnerLink({partnerUrl, partnerLinkText}) {
    function trackPartnerVisit() {
        analyticsEvents.partnerWebsite(partnerUrl);
    }

    return (
        partnerUrl &&
            <a className="partner-website" href={partnerUrl} onClick={trackPartnerVisit}>
                {partnerLinkText}{' '}
                <FontAwesomeIcon icon="external-link-alt" />
            </a>
    );
}

export default function Synopsis({model, icon, partnerLinkProps}) {
    const {verifiedFeatures, title, tags, rating, ratingCount} = model;
    const ref = useRef();

    useEffect(
        () => logScrollingInParent(ref.current, title),
        [title]
    );
    return (
        <section className="synopsis" ref={ref}>
            <img className="icon" src={icon} alt="" />
            <VerifiedBadge verifiedFeatures={verifiedFeatures} />
            <div className="headline">{title}</div>
            <div className="tags">
                {
                    tags.map((entry) =>
                        <span className="tag" key={entry.value}>
                            {entry.value}
                        </span>
                    )
                }
            </div>
            <StarsAndCount rating={rating} count={ratingCount} showNumber />
            <PartnerLink {...partnerLinkProps} />
        </section>
    );
}

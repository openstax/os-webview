import React, {useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import './synopsis.scss';
import { Model } from '../partner-context';

function VerifiedBadge({verifiedFeatures}: {verifiedFeatures?: string}) {
    const badgeImage = '/dist/images/partners/verified-badge.svg';

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
type PartnerLinkProps = {
    partnerUrl: string | null;
    partnerLinkText: string;
    partnerName: string;
}

function PartnerLink({partnerUrl, partnerLinkText, partnerName}: PartnerLinkProps) {
    return (
        partnerUrl &&
            <a
                className="partner-website" href={partnerUrl}
                target="_blank" rel="noreferrer"
                data-analytics-link={`Partner Link (${partnerName})`}
            >
                {partnerLinkText}{' '}
                <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
    );
}

export default function Synopsis({model, icon, partnerLinkProps}: {
    model: Model;
    icon: string;
    partnerLinkProps: Omit<PartnerLinkProps, 'partnerName'>;
}) {
    const {verifiedFeatures, tags, title: partnerName} = model;
    const ref = useRef(null);

    if (!partnerName) {
        return null;
    }

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
            <PartnerLink {...partnerLinkProps} partnerName={partnerName} />
        </section>
    );
}

import React, {useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import './synopsis.scss';
import { Model } from '../partner-context';

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
    const {tags, title: partnerName} = model;
    const ref = useRef(null);

    if (!partnerName) {
        return null;
    }

    return (
        <section className="synopsis" ref={ref}>
            <img className="icon" src={icon} alt="" />
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

import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import './partner-card.scss';

export default function PartnerCard({
    type,
    href,
    title,
    logoUrl,
    tags,
    onClick,
    badgeImage,
    verifiedFeatures,
    analyticsContentType
}: {
    type: string | null;
    title: string;
    href: string;
    logoUrl: string | null;
    tags: string[];
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    badgeImage?: string;
    verifiedFeatures?: string;
    analyticsContentType?: string;
}) {
    const analyticsInfo = analyticsContentType
        ? {
              'data-analytics-select-content': title,
              'data-content-type': analyticsContentType,
              'data-content-tags': `,category=${type},`
          }
        : {};

    return (
        <a className="partner-card" href={href} onClick={onClick} {...analyticsInfo}>
            <div className="logo">
                <img src={logoUrl ?? ''} alt="" />
                {verifiedFeatures && badgeImage && (
                    <div className="badge">
                        <img
                            className="background"
                            src={badgeImage}
                            alt="verified"
                        />
                        <FontAwesomeIcon className="checkmark" icon={faCheck} />
                        <div className="tooltip right">{verifiedFeatures}</div>
                    </div>
                )}
            </div>
            <div className="info">
                <div className="name">{title}</div>
                <div className="tags">
                    {tags.map((value) => (
                        <span className="tag" key={value}>
                            {value}
                        </span>
                    ))}
                </div>
            </div>
        </a>
    );
}

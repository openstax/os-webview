import React from 'react';
import {useNavigate} from 'react-router-dom';
import PartnerCard from '~/components/partner-card/partner-card';
import './partners.scss';

export default function Partners({bookAbbreviation, model}) {
    const {title, seeMoreText, blurbs, badgeImage} = model;
    const navigate = useNavigate();
    const onClick = React.useCallback(
        (event) => {
            const destUrl = event.target.getAttribute('href');

            navigate(destUrl, {
                book: bookAbbreviation,
                redirect: true
            });
            event.preventDefault();
        },
        [navigate, bookAbbreviation]
    );

    return (
        <div className="partners">
            <div className="callout"></div>
            <div className="title-bar" data-analytics-nav={title}>
                <span role="heading" aria-level="3">
                    {title}
                </span>
                <a
                    className="filter-for-book"
                    href="/partners"
                    onClick={onClick}
                >
                    {seeMoreText}
                </a>
            </div>
            <div className="blurb-scroller" data-analytics-content-list={title}>
                <ul className="blurbs">
                    {blurbs.map((blurb) => (
                        <li key={blurb.url}>
                            <PartnerCard
                                type={blurb.type}
                                title={blurb.name}
                                href={blurb.url}
                                logoUrl={blurb.image}
                                tags={[blurb.cost, blurb.type].filter((x) => x)}
                                onClick={onClick}
                                badgeImage={badgeImage}
                                verifiedFeatures={blurb.verifiedFeatures}
                                analyticsContentType='Partner Profile'
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

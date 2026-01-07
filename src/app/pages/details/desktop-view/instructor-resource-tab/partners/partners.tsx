import React from 'react';
import {NavigateOptions, useNavigate} from 'react-router-dom';
import PartnerCard from '~/components/partner-card/partner-card';
import {assertNotNull} from '~/helpers/data';
import './partners.scss';

type PartnerBlurb = {
    url: string;
    name: string;
    type: string;
    image: string;
    cost?: string;
    verifiedFeatures?: string[];
};

type PartnersModel = {
    title: string;
    seeMoreText: string;
    blurbs: PartnerBlurb[];
    badgeImage?: string;
};

export default function Partners({
    bookAbbreviation,
    model
}: {
    bookAbbreviation: string;
    model: PartnersModel;
}) {
    const {title, seeMoreText, blurbs, badgeImage} = model;
    const navigate = useNavigate();
    const onClick = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            const destUrl = event.currentTarget.getAttribute('href');

            navigate(assertNotNull(destUrl), {
                book: bookAbbreviation,
                redirect: true
            } as NavigateOptions);
            event.preventDefault();
        },
        [navigate, bookAbbreviation]
    );

    return (
        <div className="partners">
            <div className="callout"></div>
            <div className="title-bar" data-analytics-nav={title}>
                <span role="heading" aria-level={3}>
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
            <div
                className="blurb-scroller"
                data-analytics-content-list={title}
            >
                <ul className="blurbs">
                    {blurbs.map((blurb) => (
                        <li key={blurb.url}>
                            <PartnerCard
                                type={blurb.type}
                                title={blurb.name}
                                href={blurb.url}
                                logoUrl={blurb.image}
                                tags={[blurb.cost, blurb.type].filter(
                                    (x) => x
                                ) as string[]}
                                onClick={onClick}
                                badgeImage={badgeImage}
                                verifiedFeatures={blurb.verifiedFeatures?.join(', ')}
                                analyticsContentType="Partner Profile"
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

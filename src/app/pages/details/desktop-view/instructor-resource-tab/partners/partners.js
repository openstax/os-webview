import React from 'react';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import StarsAndCount from '~/components/stars-and-count/stars-and-count';
import analyticsEvents from '~/pages/partners/analytics-events';
import './partners.scss';

function Blurb({blurb, badgeImage, onClick}) {
    const tags = [blurb.cost, blurb.type].filter((x) => x);
    const {count: ratingCount, average: rating} = blurb;
    const trackClick = React.useCallback(
        (event) => {
            analyticsEvents.partnerDetailsEvent(blurb.name);
            onClick(event);
        },
        [onClick, blurb.name]
    );

    return (
        <a
          className="blurb"
          href={blurb.url}
          onClick={trackClick}
          data-analytics-select-content={blurb.name}
          data-content-type="Partner Profile"
          data-content-tags={`,category=${blurb.type},`}
        >
            <div className="logo">
                <img src={blurb.image} alt="" />
                {
                    blurb.verifiedFeatures &&
                        <div className="badge">
                            <img className="background" src={badgeImage} alt="verified" />
                            <FontAwesomeIcon className="checkmark" icon={faCheck} />
                            <div className="tooltip right">
                                {blurb.verifiedFeatures}
                            </div>
                        </div>
                }
            </div>
            <div className="info">
                <div className="name">{blurb.name}</div>
                <div className="tags">
                    {
                        tags.map((value) =>
                            <span className="tag" key={value}>
                                {value}
                            </span>
                        )
                    }
                </div>
                <StarsAndCount rating={rating} count={ratingCount} showNumber />
            </div>
        </a>
    );
}

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
                {title}
                <a className="filter-for-book" href="/partners" onClick={onClick}>{seeMoreText}</a>
            </div>
            <div
              className="blurb-scroller"
              data-analytics-content-list={title}
            >
                <div className="blurbs">
                    {
                        blurbs.map((blurb) =>
                            <Blurb
                                blurb={blurb} onClick={onClick} badgeImage={badgeImage}
                                key={blurb.url}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import {useHistory} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import StarsAndCount from '~/components/stars-and-count/stars-and-count';
import analyticsEvents from '~/pages/partners/analytics-events';
import './partners.scss';

function Blurb({blurb, badgeImage, onClick}) {
    const tags = [blurb.cost, blurb.type].filter((x) => x);
    const {count: ratingCount, average: rating} = blurb;

    function trackClick(event) {
        analyticsEvents.partnerDetails(blurb.name);
        onClick(event);
    }

    return (
        <a className="blurb" href={blurb.url} onClick={trackClick}>
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
    const history = useHistory();

    function onClick(event) {
        const destUrl = event.target.getAttribute('href');

        history.push(destUrl, {
            book: bookAbbreviation,
            redirect: true
        });
        event.preventDefault();
    }

    return (
        <div className="partners">
            <div className="callout"></div>
            <div className="title-bar">
                {title}
                <a className="filter-for-book" href="/partners" onClick={onClick}>{seeMoreText}</a>
            </div>
            <div className="blurb-scroller">
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

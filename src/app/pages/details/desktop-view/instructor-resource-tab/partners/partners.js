import React from 'react';
import routerBus from '~/helpers/router-bus';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import StarsAndCount from '~/components/stars-and-count/stars-and-count';
import analyticsEvents from '~/pages/partners/analytics-events';
import './partners.css';

function Blurb({blurb, badgeImage, onClick, partnerId}) {
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
                            <FontAwesomeIcon className="checkmark" icon="check" />
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
                <StarsAndCount rating={blurb.rating} count={blurb.ratingCount} showNumber />
            </div>
        </a>
    );
}

export default function Partners({bookAbbreviation, model}) {
    const {title, seeMoreText, blurbs, badgeImage} = model;

    function onClick(event) {
        const destUrl = event.target.getAttribute('href');

        routerBus.emit('navigate', destUrl, {
            book: bookAbbreviation
        }, true);
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
                                blurb={blurb} onClick={onClick} badgeImage={badgeImage} partnerId={blurb.id}
                                key={blurb.url}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

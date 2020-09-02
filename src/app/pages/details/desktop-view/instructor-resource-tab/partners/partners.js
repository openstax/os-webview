import React from 'react';
import routerBus from '~/helpers/router-bus';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './partners.css';

function Blurb({blurb, badgeImage, onClick}) {
    return (
        <a className="blurb" href={blurb.url} onClick={onClick}>
            <div className="logo">
                <img src={blurb.image} alt="" />
            </div>
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
            <div className="name">{blurb.name}</div>
            <div className="tags">
                {
                    blurb.cost &&
                        <div className="info">
                            <span className="label">Cost:</span>
                            {blurb.cost}
                        </div>
                }
                {
                    blurb.type &&
                        <div className="info">
                            <span className="label">Type:</span>{blurb.type}
                        </div>
                }
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

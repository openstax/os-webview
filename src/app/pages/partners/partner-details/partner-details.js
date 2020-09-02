import React, {useState, useEffect, useRef} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Carousel from './carousel/carousel';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './partner-details.css';
import booksPromise from '~/models/books';
import analyticsEvents from '../analytics-events';
import shellBus from '~/components/shell/shell-bus';

function useRealTitles(books) {
    const [titles, setTitles] = useState(books);

    function getTitlesFromAbbreviations(abbreviations, bookInfo) {
        return abbreviations
            .map((abbrev) => bookInfo.find((b) => b.salesforce_abbreviation === abbrev) || abbrev)
            .filter((b) => {
                const found = typeof b === 'object';

                if (!found) {
                    console.warn('Book not found:', b);
                }
                return found;
            })
            .map((b) => b.salesforce_name);
    }

    useEffect(
        () =>
            booksPromise.then((results) => setTitles(getTitlesFromAbbreviations(books, results))),
        [books]
    );

    return titles;
}

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

function PartnerLink({partnerUrl, partnerLinkText}) {
    function trackPartnerVisit() {
        analyticsEvents.partnerWebsite(partnerUrl);
    }

    return (
        partnerUrl &&
            <a className="partner-website" href={partnerUrl} onClick={trackPartnerVisit}>
                {partnerLinkText}
                <FontAwesomeIcon icon="external-link-alt" />
            </a>
    );
}

function RequestInfoButton({infoUrl, infoText}) {
    function trackInfoRequest(event) {
        analyticsEvents.requestInfo(this.title);
        shellBus.emit('hideDialog');
    }

    return (
        infoUrl &&
            <section>
                <a className="btn primary" href={infoUrl} onClick={trackInfoRequest}>{infoText}</a>
            </section>
    );
}

function logScrollingInParent(el, name) {
    const scrollingRegion = el.parentNode.parentNode;
    // eslint-disable-next-line prefer-const
    let scrollCallback;
    const removeScrollListener = () => scrollingRegion.removeEventListener('scroll', scrollCallback);

    scrollCallback = (event) => {
        analyticsEvents.lightboxScroll(name);
        removeScrollListener();
    };

    scrollingRegion.addEventListener('scroll', scrollCallback);

    return removeScrollListener;
}

function PartnerDetails({
    verifiedFeatures, title: headline, richDescription: description,
    website, partner_website: partnerWebsite, websiteLinkText: partnerLinkText,
    infoUrl, infoLinkText: infoText, books, tags, logoUrl, images, videos
}
) {
    const icon = logoUrl || 'https://via.placeholder.com/150x150?text=[no%20logo]';
    const titles = useRealTitles(books);
    const ref = useRef();

    useEffect(() => {
        logScrollingInParent(ref.current, headline);
    }, []);

    return (
        <React.Fragment>
            <section className="synopsis" ref={ref}>
                <img className="icon" src={icon} alt="" />
                <VerifiedBadge verifiedFeatures={verifiedFeatures} />
                <div className="headline">{headline}</div>
                <PartnerLink {...{partnerUrl: website || partnerWebsite, partnerLinkText}} />
            </section>
            <div className="scrolling-region text-content">
                <section className="carousel">
                    <Carousel {...{icon, images, videos}} />
                </section>
                <RequestInfoButton {...{infoUrl, infoText}} />
                <hr />
                <section>
                    <h2>Overview</h2>
                    <RawHTML className="main-text" html={description} />
                    <h2>Related Books</h2>
                    <div className="titles">
                        {
                            titles.map((title) =>
                                <span className="title" key={title}>{title}</span>
                            )
                        }
                    </div>
                    <h2>Related Tags</h2>
                    <div className="tags">
                        {
                            tags.map((entry) =>
                                <span className="tag" key={entry.value}>
                                    {entry.label}: {entry.value}
                                </span>
                            )
                        }
                    </div>
                </section>
            </div>
        </React.Fragment>
    );
}

// This still returns a Superb component because that is what the Dialog expects
// Possible future development: make Dialog handle React components.
// That will be a job in itself.
const view = {
    classes: ['partner-details']
};

export default pageWrapper(PartnerDetails, view);

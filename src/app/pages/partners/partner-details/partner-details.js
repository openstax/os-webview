import React, {useState, useEffect, useRef, useContext} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import Synopsis from './synopsis/synopsis';
import Carousel from './carousel/carousel';
import Reviews from './reviews/reviews';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
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

function Overview({model, icon}) {
    const {
        richDescription: description,
        infoUrl, infoLinkText: infoText,
        books, images, videos
    } = model;
    const titles = useRealTitles(books);

    return (
        <React.Fragment>
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
            </section>
        </React.Fragment>
    );
}

function ContentTabs({model, icon}) {
    const labels = ['Overview', 'Reviews'];
    const [selectedLabel, setSelectedLabel] = useState(labels[0]);

    return (
        <React.Fragment>
            <TabGroup {...{labels, selectedLabel, setSelectedLabel}} />
            <div className="tab-content">
                <ContentGroup activeIndex={labels.indexOf(selectedLabel)}>
                    <Overview model={model} icon={icon} />
                    <Reviews partnerId={model.id} />
                </ContentGroup>
            </div>
        </React.Fragment>
    );
}

function PartnerDetails(model) {
    const {
        website, partner_website: partnerWebsite, websiteLinkText: partnerLinkText,
        logoUrl
    } = model;
    const icon = logoUrl || 'https://via.placeholder.com/150x150?text=[no%20logo]';
    const partnerLinkProps = {partnerUrl: website || partnerWebsite, partnerLinkText};

    return (
        <div className="partner-details" onClick={(e) => e.stopPropagation()}>
            <Synopsis {...{model, icon, partnerLinkProps}} />
            <div className="scrolling-region text-content" onClick={(e) => e.stopPropagation()}>
                <ContentTabs model={model} icon={icon} />
            </div>
        </div>
    );
}

// This still returns a Superb component because that is what the Dialog expects
// Possible future development: make Dialog handle React components.
// That will be a job in itself.
export default pageWrapper(PartnerDetails);

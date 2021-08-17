import React, {useState, useEffect, useRef} from 'react';
import {PartnerContextProvider} from './partner-context';
import Synopsis from './synopsis/synopsis';
import Carousel from './carousel/carousel';
import Reviews from './reviews/reviews';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import booksPromise from '~/models/books';
import analyticsEvents from '../analytics-events';
import './partner-details.scss';

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

function RequestInfoButton({infoUrl, infoText, partnerName}) {
    function trackInfoRequest() {
        analyticsEvents.requestInfo(partnerName);
    }

    return (
        infoUrl && infoText &&
            <section>
                <a className="btn primary" href={infoUrl} onClick={trackInfoRequest}>{infoText}</a>
            </section>
    );
}

function Overview({model, icon}) {
    const {
        richDescription: description,
        infoUrl, infoLinkText: infoText,
        books, images, videos, title: partnerName
    } = model;
    const titles = useRealTitles(books);

    // For TESTING
    // if (images.length < 6) {
    //     images.push(...([1,2,3,4,'last'].map(
    //         (i) => `https://via.placeholder.com/150x150?text=[image ${i}]`
    //     )));
    // }
    // console.info('Images', images);
    // TESTING
    return (
        <React.Fragment>
            <section className="carousel">
                <Carousel {...{icon, images, videos}} />
            </section>
            <RequestInfoButton {...{infoUrl, infoText, partnerName}} />
            <hr />
            <section className="overview">
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

function logScrollingInRegion(detailsEl, name) {
    if (!detailsEl) {
        return null;
    }
    const scrollingRegion = detailsEl.closest('.main-region');
    const removeScrollListener = (callback) => scrollingRegion.removeEventListener('scroll', callback);
    const scrollCallback = () => {
        analyticsEvents.lightboxScroll(name);
        removeScrollListener(scrollCallback);
    };

    scrollingRegion.addEventListener('scroll', scrollCallback);

    return () => removeScrollListener(scrollCallback);
}

function PartnerDetails({model}) {
    const {
        website, partnerWebsite, websiteLinkText: partnerLinkText,
        logoUrl
    } = model;
    const icon = logoUrl || 'https://via.placeholder.com/150x150?text=[no%20logo]';
    const partnerLinkProps = {partnerUrl: website || partnerWebsite, partnerLinkText};
    const labels = ['Overview', 'Reviews'];
    const [selectedLabel, setSelectedLabel] = useState(labels[0]);
    const ref = useRef();

    useEffect(() => logScrollingInRegion(ref.current, model.title), [model.title]);

    useEffect(() => {
        if (selectedLabel === 'Reviews') {
            analyticsEvents.viewReviews(model.title);
        }
    }, [selectedLabel, model.title]);

    return (
        <div
            className="partner-details" onClick={(e) => e.stopPropagation()}
            ref={ref}
        >
            <div className="sticky-region">
                <Synopsis {...{model, icon, partnerLinkProps}} />
                <TabGroup {...{labels, selectedLabel, setSelectedLabel}} />
            </div>
            <div className="scrolling-region boxed" onClick={(e) => e.stopPropagation()}>
                <div className="tab-content">
                    <ContentGroup activeIndex={labels.indexOf(selectedLabel)}>
                        <Overview model={model} icon={icon} />
                        <Reviews partnerId={model.id} />
                    </ContentGroup>
                </div>
            </div>
        </div>
    );
}

export default function PartnerDetailsWrapper({detailData: {id, ...model}}) {
    return (
        <PartnerContextProvider contextValueParameters={id}>
            <PartnerDetails model={model} />
        </PartnerContextProvider>
    );
}

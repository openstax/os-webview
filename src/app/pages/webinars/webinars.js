import React, {useState} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage, useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import ClippedImage from '~/components/clipped-image/clipped-image';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import AccordionGroup from '~/components/accordion-group/accordion-group.js';
import $ from '~/helpers/$';
import WebinarList from './webinar-list/webinar-list';
import './webinars.css';

const tabLabels = ['Upcoming webinars', 'Past webinar recordings'];

function byDate(a, b) {
    const da = new Date(a.start);
    const db = new Date(b.start);

    return da - db;
}

function Webinars({data: {headline, description, heroImage, ...props}}) {
    const [selectedLabel, setSelectedLabel] = useState(tabLabels[0]);
    const webinarData = $.camelCaseKeys(
        (useDataFromSlug('webinars/?format=json') || []).sort(byDate)
    );
    const firstFuture = webinarData.findIndex((entry) => new Date(entry.start) > Date.now());
    const upcomingData = webinarData.slice(firstFuture);
    const pastData = webinarData.slice(0, firstFuture);
    const tabContents = [
        <WebinarList key="1" data={upcomingData} upcoming />,
        <WebinarList key="2" data={pastData} />
    ];
    const accordionItems = tabLabels.map((title, i) => ({
        title,
        contentComponent: tabContents[i]
    }));

    function setSelectedAndUpdateUrl(newValue) {
        const newSearchString = $.replaceSearchTerm(tabLabels, selectedLabel, newValue);

        setSelectedLabel(newValue);
        window.history.replaceState({}, selectedLabel, newSearchString);
    }
    return (
        <React.Fragment>
            <div className="hero">
                <div className="text-side">
                    <h1>{headline}</h1>
                    <div>{description}</div>
                </div>
                <ClippedImage className="picture-side" src={heroImage.meta.downloadUrl} />
            </div>
            <main>
                <div className="content">
                    <h1>Webinars</h1>
                    <div className="phone-view">
                        <AccordionGroup items={accordionItems} />
                    </div>
                    <div className="bigger-view">
                        <TabGroup
                            TabTag="h2" labels={tabLabels}
                            selectedLabel={selectedLabel}
                            setSelectedLabel={setSelectedAndUpdateUrl}
                        />
                        <ContentGroup activeIndex={tabLabels.indexOf(selectedLabel)}>
                            {tabContents}
                        </ContentGroup>
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
}

function WebinarsLoader() {
    return (
        <LoaderPage slug="pages/webinars" Child={Webinars} doDocumentSetup />
    );
}

const view = {
    classes: ['webinars', 'page'],
    tag: 'main'
};

export default pageWrapper(WebinarsLoader, view);

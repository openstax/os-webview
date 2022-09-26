import React, {useState} from 'react';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import ClippedImage from '~/components/clipped-image/clipped-image';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group.jsx';
import AccordionGroup from '~/components/accordion-group/accordion-group.js';
import $ from '~/helpers/$';
import WebinarList from './webinar-list/webinar-list';
import './webinars.scss';

const tabLabels = ['Upcoming webinars', 'Past webinar recordings'];

function byDate(a, b) {
    const da = new Date(a.start);
    const db = new Date(b.start);

    return da - db;
}

function Webinars({data: {heading: headline, description, heroImage}}) {
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
                    <h2>Webinars</h2>
                    <div className="phone-view">
                        <AccordionGroup items={accordionItems} />
                    </div>
                    <div className="bigger-view">
                        <TabGroup
                            TabTag="h3" labels={tabLabels}
                            selectedLabel={selectedLabel}
                            setSelectedLabel={setSelectedLabel}
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

export default function WebinarsLoader() {
    return (
        <main className="webinars page">
            <LoaderPage slug="pages/webinars" Child={Webinars} doDocumentSetup />
        </main>
    );
}

import React, {useState} from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Hero from '~/components/hero/hero';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import AccordionGroup from '~/components/accordion-group/accordion-group.js';
import PeopleTab from './people-tab/people-tab';
import $ from '~/helpers/$';
import './team.scss';

function TeamPage({data: {
    header: heroHeadline,
    subheader: heroParagraph,
    headerImageUrl: heroImage,
    teamHeader,
    openstaxPeople
}}) {
    const accordionItems = openstaxPeople.map((t, i) => ({
        title: t.heading,
        contentComponent: <PeopleTab data={t.people} key={i} />
    }));
    const tabLabels = accordionItems.map((i) => i.title);
    const tabContents = accordionItems.map((i) => i.contentComponent);
    const [selectedLabel, setSelectedLabel] = useState(tabLabels[0]);

    function setSelectedAndUpdateUrl(newValue) {
        const newSearchString = $.replaceSearchTerm(tabLabels, selectedLabel, newValue);

        setSelectedLabel(newValue);
        window.history.replaceState({}, selectedLabel, newSearchString);
    }
    return (
        <React.Fragment>
            <Hero src={heroImage} alt="">
                <div>
                    <h1>{heroHeadline}</h1>
                    <div>{heroParagraph}</div>
                </div>
            </Hero>
            <section className="team">
                <h2>{teamHeader}</h2>
                <div className="phone-view">
                    <AccordionGroup items={accordionItems} />
                </div>
                <div className="bigger-view">
                    <TabGroup
                        TabTag="h3" labels={tabLabels}
                        selectedLabel={selectedLabel}
                        setSelectedLabel={setSelectedAndUpdateUrl}
                    />
                    <ContentGroup activeIndex={tabLabels.indexOf(selectedLabel)}>
                        {tabContents}
                    </ContentGroup>
                </div>
            </section>
        </React.Fragment>
    );
}

export default function TeamLoader() {
    return (
        <main className="team page">
            <LoaderPage slug="pages/team" Child={TeamPage} doDocumentSetup />
        </main>
    );
}

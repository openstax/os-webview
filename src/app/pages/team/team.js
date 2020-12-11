import React, {useState} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import AccordionGroup from '~/components/accordion-group/accordion-group.jsx';
import PeopleTab from './people-tab/people-tab';
import $ from '~/helpers/$';
import './team.css';

function TeamPage({data: {
    header: heroHeadline,
    subheader: heroParagraph,
    headerImageUrl: heroImage,
    teamHeader,
    openstaxPeople,
    ...unhandled
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
            <section className="hero">
                <div className="text-content">
                    <div>
                        <h1>{heroHeadline}</h1>
                        <div>{heroParagraph}</div>
                    </div>
                </div>
                <div className="picture-content">
                    <img src={heroImage} alt="" />
                </div>
            </section>
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

function TeamLoader() {
    return (
        <LoaderPage slug="pages/team" Child={TeamPage} doDocumentSetup />
    );
}

const view = {
    classes: ['team', 'page'],
    tag: 'main' // if the HTML doesn't contain a main tag
};

export default pageWrapper(TeamLoader, view);

// const spec = {
//     onDataLoaded() {
//         const tabLabels = data.openstax_people.map((t) => t.heading);
//         const tabContents = data.openstax_people.map((t) => new PeopleTab(() => t.people));
//         let selectedTab = tabLabels[0];
//         const contents = {};
//
//         tabLabels.forEach((v, i) => {
//             contents[v] = tabContents[i];
//         });
//
//         const contentGroup = new ContentGroup(() => ({
//             selectedTab,
//             contents
//         }));
//         const tabGroup = new TabGroup(() => ({
//             tag: 'h3',
//             tabLabels,
//             selectedTab,
//             setSelected(newValue) {
//                 selectedTab = newValue;
//                 contentGroup.update();
//             }
//         }));
//         const accordionItems = data.openstax_people.map((t) => (
//             {
//                 title: t.heading,
//                 contentComponent: new PeopleTab(() => t.people)
//             }
//         ));
//
//         this.regions.tabGroup.attach(tabGroup);
//         this.regions.tabContent.attach(contentGroup);
//         this.regions.accordion.attach(new AccordionGroup({
//             items: accordionItems
//         }));
//     }
//
// }

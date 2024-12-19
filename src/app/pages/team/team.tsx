import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import Hero from '~/components/hero/hero';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import PeopleTab from './people-tab/people-tab';
import {Tabs, Item} from '~/components/tablist/tablist';
import './team.scss';

function TeamPage({
    data: {
        header: heroHeadline,
        subheader: heroParagraph,
        headerImageUrl: heroImage,
        teamHeader,
        openstaxPeople
    }
}: {
    data: {
        header: string;
        subheader: string;
        headerImageUrl: string;
        teamHeader: string;
        openstaxPeople: Array<{
            heading: string;
            people: unknown[];
        }>;
    };
}) {
    const accordionItems = openstaxPeople.map((t, i) => ({
        title: t.heading,
        contentComponent: <PeopleTab data={t.people} key={i} />
    }));

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
                    <Tabs aria-label="Sub-teams">
                        {accordionItems.map((i) => (
                            <Item key={i.title} title={i.title}>
                                {i.contentComponent}
                            </Item>
                        ))}
                    </Tabs>
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

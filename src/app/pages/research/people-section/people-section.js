import React, {useState} from 'react';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import AccordionGroup from '~/components/accordion-group/accordion-group.js';
import AlumniTab from './alumni-tab/alumni-tab';
import MembersTab from './members-tab/members-tab';
import './people-section.scss';

function DesktopTabs({labels, initialSelection, children}) {
    const [selectedLabel, setSelectedLabel] = useState(labels[initialSelection]);
    const selectedIndex = labels.indexOf(selectedLabel);

    return (
        <div className="desktop-only">
            <TabGroup
                TabTag="h2" labels={labels}
                {...{selectedLabel, setSelectedLabel}}
            />
            <ContentGroup activeIndex={selectedIndex}>
                {children}
            </ContentGroup>
        </div>
    );
}

function TabAccordionCombo({children}) {
    const labels = React.Children.map(children, (c) => c.props.label);
    const initialSelection = children.findIndex((c) => c.props.selected) || 0;
    const items = React.Children.map(children, (child, i) => ({
        title: labels[i],
        contentComponent: child
    }));

    return (
        <React.Fragment>
            <DesktopTabs labels={labels} initialSelection={initialSelection}>
                {children}
            </DesktopTabs>
            <div className="mobile-only">
                <AccordionGroup items={items} preExpanded={[labels[initialSelection]]} />
            </div>
        </React.Fragment>
    );
}

export default function PeopleSection({
    data: {peopleHeader, alumni, currentMembers, externalCollaborators}
}) {
    return (
        <section className="people-section">
            <div className="content">
                <h1>{peopleHeader}</h1>
                <TabAccordionCombo>
                    <AlumniTab label="Alumni" data={alumni} />
                    <MembersTab
                        label="Current members" data={currentMembers}
                        selected />
                    <AlumniTab label="External collaborators" data={externalCollaborators} />
                </TabAccordionCombo>
            </div>
        </section>
    );
}

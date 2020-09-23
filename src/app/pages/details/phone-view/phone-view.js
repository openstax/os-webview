import React from 'react';
import LetUsKnow from '../common/let-us-know/let-us-know';
import GetThisTitle from '../common/get-this-title';
import AccordionGroup from '~/components/accordion-group/accordion-group.jsx';
import $ from '~/helpers/$';
import DetailsPane from './details-pane/details-pane';
import InstructorResourcesPane from './instructor-resources-pane/instructor-resources-pane';
import StudentResourcesPane from './student-resources-pane/student-resources-pane';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useTableOfContents} from '../common/hooks';
import {ErrataContents, GiveLink} from '../common/common';
import './phone-view.css';

function TocPane({model}) {
    const tocHtml = useTableOfContents(model);

    return (
        <div className="toc-drawer">
            <RawHTML html={tocHtml} className="table-of-contents" />
        </div>
    );
}

function ErrataPane({model, polish}) {
    return (
        <div className="errata-pane">
            <ErrataContents model={model} polish={polish} />
        </div>
    );
}

function items(model) {
    const polish = $.isPolish(model.title);
    const result = polish ?
        [
            {
                title: 'Szczegóły książki',
                contentComponent: <DetailsPane model={model} polish={polish} />
            }
        ] :
        [
            {
                title: 'Book details',
                contentComponent: <DetailsPane model={model} polish={polish} />
            },
            {
                title: 'Instructor resources',
                titleTag: 'updated',
                contentComponent: <InstructorResourcesPane model={model} />
            },
            {
                title: 'Student resources',
                openTitle: `Student resources (${model.bookStudentResources.length})`,
                contentComponent: <StudentResourcesPane model={model} />
            }
        ];

    const includeTOC = ['live', 'new_edition_available'].includes(model.bookState);

    if (includeTOC) {
        result.splice(1, 0, {
            title: polish ? 'Spis treści' : 'Table of contents',
            contentComponent: <TocPane model={model} />
        });
        result.push({
            title: polish ? 'Zgłoś erratę' : 'Report errata',
            contentComponent: <ErrataPane model={model} polish={polish} />
        });
    }

    result.push({
        inline: <GiveLink content={model.giveToday.content} />
    });

    return result;
}

export default function PhoneView({model}) {
    const accordionItems = items(model);
    const selectedTab = $.findSelectedTab(accordionItems.map((i) => i.title));

    return (
        <div className="detail-phone-view">
            <div className="main-grid">
                <GetThisTitle model={model} />
                <div className="accordion-region">
                    <AccordionGroup items={items(model)} preExpanded={[selectedTab]} />
                </div>
            </div>
            <div className="let-us-know-region">
                <LetUsKnow title={model.title} />
            </div>
        </div>
    );
}

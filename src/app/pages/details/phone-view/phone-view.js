import React from 'react';
import LetUsKnow from '../common/let-us-know/let-us-know';
import GetThisTitle from '../common/get-this-title';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import useDetailsContext from '../context';
import $ from '~/helpers/$';
import JITLoad from '~/helpers/jit-load';
import {findSelectedTab} from '../common/tab-utils';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {useTableOfContents} from '../common/hooks';
import {ErrataContents, GiveLink} from '../common/common';
import './phone-view.scss';

const importDetailsPane = () => import('./details-pane/details-pane.js');
const importInstructorPane = () => import('./instructor-resources-pane/instructor-resources-pane.js');
const importStudentPane = () => import('./student-resources-pane/student-resources-pane.js');

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
                contentComponent: <JITLoad importFn={importDetailsPane} model={model} polish={polish} />
            }
        ] :
        [
            {
                title: 'Book details',
                contentComponent: <JITLoad importFn={importDetailsPane} model={model} polish={polish} />
            },
            {
                title: 'Instructor resources',
                titleTag: 'updated',
                contentComponent: <JITLoad importFn={importInstructorPane} model={model} />
            },
            {
                title: 'Student resources',
                openTitle: `Student resources (${model.bookStudentResources.length})`,
                contentComponent: <JITLoad importFn={importStudentPane} model={model} />
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
        inline: <GiveLink />
    });

    return result;
}

export default function PhoneView() {
    const model = useDetailsContext();
    const accordionItems = items(model);
    const selectedTab = findSelectedTab(accordionItems.map((i) => i.title));

    return (
        <div className="detail-phone-view">
            <div className="main-grid">
                <GetThisTitle model={model} />
                <div className="accordion-region">
                    <AccordionGroup
                      data-analytics-nav="Book Details Accordion"
                      items={items(model)}
                      preExpanded={[selectedTab]}
                    />
                </div>
            </div>
            <div className="let-us-know-region">
                <LetUsKnow title={model.title} />
            </div>
        </div>
    );
}

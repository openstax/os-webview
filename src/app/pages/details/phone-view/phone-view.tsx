import React from 'react';
import LetUsKnow from '../common/let-us-know/let-us-know';
import GetThisTitle from '../common/get-this-title';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import useDetailsContext, {type ContextValues} from '../context';
import $ from '~/helpers/$';
import JITLoad from '~/helpers/jit-load';
import {findSelectedTab} from '../common/tab-utils';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {useTableOfContents} from '../common/hooks';
import {ErrataContents, GiveLink} from '../common/common';
import './phone-view.scss';

const importDetailsPane = () => import('./details-pane/details-pane');
const importInstructorPane = () =>
    import('./instructor-resources-pane/instructor-resources-pane');
const importStudentPane = () =>
    import('./student-resources-pane/student-resources-pane');

function TocPane() {
    const tocHtml = useTableOfContents();

    return (
        <div className="toc-drawer">
            <RawHTML html={tocHtml} className="table-of-contents" />
        </div>
    );
}

function ErrataPane() {
    return (
        <div className="errata-pane">
            <ErrataContents />
        </div>
    );
}

type AccordionItem = {
    title: string;
    titleTag?: string;
    openTitle?: string;
    contentComponent: React.ReactNode;
} | {
    inline: React.ReactNode;
};

function items(model: ContextValues) {
    const polish = $.isPolish(model.title);
    const result: AccordionItem[] = polish
        ? [
              {
                  title: 'Szczegóły książki',
                  contentComponent: (
                      <JITLoad
                          importFn={importDetailsPane}
                          model={model}
                          polish={polish}
                      />
                  )
              }
          ]
        : [
              {
                  title: 'Book details',
                  contentComponent: (
                      <JITLoad
                          importFn={importDetailsPane}
                          model={model}
                          polish={polish}
                      />
                  )
              },
              {
                  title: 'Instructor resources',
                  titleTag: 'updated',
                  contentComponent: (
                      <JITLoad importFn={importInstructorPane} model={model} />
                  )
              },
              {
                  title: 'Student resources',
                  openTitle: `Student resources (${model.bookStudentResources.length})`,
                  contentComponent: (
                      <JITLoad importFn={importStudentPane} model={model} />
                  )
              }
          ];

    const includeTOC = ['live', 'new_edition_available'].includes(
        model.bookState
    );

    if (includeTOC) {
        result.splice(1, 0, {
            title: polish ? 'Spis treści' : 'Table of contents',
            contentComponent: <TocPane />
        });
        result.push({
            title: polish ? 'Zgłoś erratę' : 'Report errata',
            contentComponent: <ErrataPane />
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
    const selectedTab = findSelectedTab(
        accordionItems.filter((i) => 'title' in i)
        .map((i) => i.title)
    );

    return (
        <div className="detail-phone-view">
            <div className="main-grid">
                <GetThisTitle model={model} />
                <div className="accordion-region">
                    <AccordionGroup
                        data-analytics-nav="Book Details Accordion"
                        items={accordionItems}
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

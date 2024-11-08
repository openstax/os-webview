import React from 'react';
import {useToggle} from '~/helpers/data';
import {
    TocOption,
    WebviewOption,
    PdfOption,
    BookshareOption,
    IbooksOption,
    KindleOption,
    CheggOption,
    OptionExpander
} from './get-this-title-files/options';
import OrderPrintCopy from './get-this-title-files/order-print-copy/order-print-copy';
import './get-this-title-files/get-this-title.scss';
import trackLink from './track-link';

export type Model = {
    id: string;
    slug: string;
    bookState: string;
    comingSoon: boolean;
    title: string;
    bookshareLink: string;
    ibookLink: string;
    ibookLink2: string;
    kindleLink: string;
    webviewRexLink: string;
    webviewLink: string;
    contentWarningText?: string;
    rexCalloutTitle?: string;
    rexCalloutBlurb?: string;
    highResolutionPdfUrl: string;
    lowResolutionPdfUrl: string;
    cheggLink: string; // These may not be supported at all anymore,
    cheggLinkText: string; // but the CMS is still serving them.
};
type ModelKey = 'bookshareLink' | 'ibookLink' | 'kindleLink';
type TrackedMouseEvent = Parameters<typeof trackLink>[0];

function AdditionalOptions({model}: {model: Model}) {
    return (
        <React.Fragment>
            <BookshareOption model={model} />
            <IbooksOption model={model} />
            <KindleOption model={model} />
        </React.Fragment>
    );
}

export default function GetThisTitle({model}: {model: Model}) {
    const additionalOptions = (
        ['bookshareLink', 'ibookLink', 'kindleLink'] as ModelKey[]
    ).filter((key) => model[key]).length;
    const [expanded, toggleExpanded] = useToggle(additionalOptions < 1);
    const interceptLinkClicks = React.useCallback<React.MouseEventHandler>(
        (event: TrackedMouseEvent) => {
            trackLink(event, model.id);
        },
        [model.id]
    );

    return (
        <div className="get-the-book">
            <div className="get-this-title">
                <div
                    className="options"
                    onClick={interceptLinkClicks}
                    data-analytics-nav="Get the book"
                >
                    <TocOption model={model} />
                    <WebviewOption model={model} />
                    <PdfOption model={model} />
                    <CheggOption model={model} />
                    {expanded && <AdditionalOptions model={model} />}
                    <OptionExpander
                        {...{expanded, additionalOptions}}
                        toggle={toggleExpanded}
                    />
                </div>
            </div>
            <OrderPrintCopy slug={model.slug} />
        </div>
    );
}

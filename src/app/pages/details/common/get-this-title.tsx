import React from 'react';
import {useToggle} from '~/helpers/data';
import {
    TocOption,
    WebviewOption,
    PdfOption,
    BookshareOption,
    OptionExpander
} from './get-this-title-files/options';
import './get-this-title-files/get-this-title.scss';
import trackLink from './track-link';

export type Model = {
    id: number;
    slug: string;
    bookState: string;
    comingSoon: boolean;
    title: string;
    bookshareLink: string;
    webviewRexLink: string;
    webviewLink: string;
    contentWarningText: string | null;
    rexCalloutTitle?: string;
    rexCalloutBlurb?: string;
    pdfUrl: string | null;
    highResolutionPdfUrl: string | null; // deprecated alias of pdfUrl
};
type ModelKey = 'bookshareLink';
type TrackedMouseEvent = Parameters<typeof trackLink>[0];

function AdditionalOptions({model}: {model: Model}) {
    return (
        <React.Fragment>
            <BookshareOption model={model} />
        </React.Fragment>
    );
}

export default function GetThisTitle({model}: {model: Model}) {
    const additionalOptions = (
        ['bookshareLink'] as ModelKey[]
    ).filter((key) => model[key]).length;
    const [expanded, toggleExpanded] = useToggle(additionalOptions < 1);
    const interceptLinkClicks = React.useCallback<React.MouseEventHandler>(
        (event: TrackedMouseEvent) => {
            trackLink(event, model.id.toString());
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
                    {expanded && <AdditionalOptions model={model} />}
                    <OptionExpander
                        {...{expanded, additionalOptions}}
                        toggle={toggleExpanded}
                    />
                </div>
            </div>
        </div>
    );
}

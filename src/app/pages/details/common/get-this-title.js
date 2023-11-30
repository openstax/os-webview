import React from 'react';
import {useToggle} from '~/helpers/data';
import {
    TocOption, WebviewOption, PdfOption, BookshareOption,
    IbooksOption, KindleOption, CheggOption, OptionExpander
} from './get-this-title-files/options';
import useAmazonAssociatesLink from '~/pages/details/common/get-this-title-files//amazon-associates-link';
import OrderPrintCopy from './get-this-title-files/order-print-copy/order-print-copy';
import './get-this-title-files/get-this-title.scss';
import trackLink from './track-link';
import useAmazonIframe from './get-this-title-files/order-print-copy/use-amazon-iframe';

function AdditionalOptions({model}) {
    return (
        <React.Fragment>
            <BookshareOption model={model} />
            <IbooksOption model={model} />
            <KindleOption model={model} />
        </React.Fragment>
    );
}

export default function GetThisTitle({model}) {
    const additionalOptions = [
        'bookshareLink', 'ibookLink', 'kindleLink'
    ].filter((key) => model[key]).length;
    const [expanded, toggleExpanded] = useToggle(additionalOptions < 1);
    const interceptLinkClicks = React.useCallback(
        (event) => {
            trackLink(event, model.id);
        },
        [model.id]
    );
    const amazonDataLink = useAmazonAssociatesLink(model.slug);
    const iframeCode = useAmazonIframe(model.slug);

    return (
        <div className="get-the-book">
            <div className="get-this-title">
                <div className="options" onClick={interceptLinkClicks} data-analytics-nav="Get the book">
                    <TocOption model={model} />
                    <WebviewOption model={model} />
                    <PdfOption model={model} />
                    <CheggOption model={model} />
                    {
                        expanded &&
                            <AdditionalOptions model={model} />
                    }
                    <OptionExpander {...{expanded, additionalOptions}} toggle={toggleExpanded} />
                </div>
            </div>
            <OrderPrintCopy amazonDataLink={amazonDataLink} iframeCode={iframeCode} />
        </div>
    );
}

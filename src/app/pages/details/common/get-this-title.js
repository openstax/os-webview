import React, {useState} from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import userModel from '~/models/usermodel';
import {
    TocOption, WebviewOption, StudyEdgeOption, PdfOption, PrintOption, BookshareOption,
    IbooksOption, KindleOption, CheggOption, OptionExpander
} from './get-this-title-files/options';
import './get-this-title-files/get-this-title.css';
import linkhelper from '~/helpers/link';

let userInfo;

userModel.load().then((i) => {
    userInfo = i;
});

function AdditionalOptions({model, toggle}) {
    return (
        <React.Fragment>
            <BookshareOption model={model} />
            <IbooksOption model={model} />
            <KindleOption model={model} />
            <CheggOption model={model} />
        </React.Fragment>
    );
}

export default function GetThisTitle({model, tocState}) {
    const additionalOptions = [
        'bookshareLink', 'ibookLink', 'kindleLink', 'cheggLink'
    ].filter((key) => model[key]).length;
    const [expanded, toggleExpanded] = useToggle(additionalOptions < 1);

    function interceptLinkClicks(event) {
        const el = linkhelper.validUrlClick(event);

        if (!el) {
            return;
        }
        const trackThis = userInfo.accounts_id && el.dataset.track;

        if (trackThis) {
            event.trackingInfo = {
                book: model.id,
                account_id: userInfo.accounts_id, // eslint-disable-line camelcase
                book_format: el.dataset.track // eslint-disable-line camelcase
            };
        }
    }

    return (
        <div className="get-the-book">
            <div className="get-this-title">
                <div className="options" onClick={interceptLinkClicks}>
                    <TocOption model={model} tocState={tocState} />
                    <WebviewOption model={model} />
                    <StudyEdgeOption model={model} />
                    <PdfOption model={model} />
                    <PrintOption model={model} />
                    {
                        expanded &&
                            <AdditionalOptions model={model} toggle={toggleExpanded} />
                    }
                    <OptionExpander {...{expanded, additionalOptions}} toggle={toggleExpanded} />
                </div>
            </div>
        </div>
    );
}

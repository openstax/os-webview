import React, {useEffect, useRef} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {Authors, PublicationInfo, ErrataSection} from '../../common/common';
import GetThisTitle from '../../common/get-this-title';
import LetUsKnow from '../../common/let-us-know/let-us-know';
import './details-tab.css';

function PolishTab({model, tocState}) {
    const errataBlurb = model.errataContent.content.content;

    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h3>Przejdź do książki</h3>
                    <GetThisTitle model={model} tocState={tocState} />
                </div>
                <div className="let-us-know-region" skip="true">
                    <LetUsKnow title={model.title} />
                </div>
            </div>
            <div className="main">
                <div className="loc-summary-text">
                    <h3>Podsumowanie</h3>
                    <RawHTML html={model.description} />
                </div>
                <Authors model={model} polish={true} />
                <ErrataSection model={model} polish={true} />
                <PublicationInfo model={model} polish={true} />
            </div>
        </div>
    );
}

function EnglishTab({model, tocState}) {
    const errataBlurb = model.errataContent.content.content;

    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h3>Get the book</h3>
                    <GetThisTitle model={model} tocState={tocState} />
                </div>
                <div className="let-us-know-region">
                    <LetUsKnow title={model.salesforceAbbreviation} />
                </div>
            </div>
            <div className="main">
                <div className="loc-summary-text">
                    <h3>Summary</h3>
                    <RawHTML html={model.description} />
                </div>
                <Authors model={model} />
                <ErrataSection model={model} />
                <div className="publication-info">
                    <PublicationInfo model={model} url={null} />
                </div>
            </div>
        </div>
    );
}

export default function DetailsTab({model, polish, tocState}) {
    const Child = polish ? PolishTab : EnglishTab;

    return (<Child model={model} tocState={tocState} />);
}

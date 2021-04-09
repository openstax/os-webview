import React from 'react';
import LazyLoad from 'react-lazyload';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {Authors, PublicationInfo, ErrataSection} from '../../common/common';
import GetThisTitle from '../../common/get-this-title';
import LetUsKnow from '../../common/let-us-know/let-us-know';
import SavingsBlurb from '../../common/savings-blurb';
import './details-tab.scss';

function PolishTab({model, tocState}) {
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
                <LazyLoad>
                    <ErrataSection model={model} polish={true} />
                </LazyLoad>
                <LazyLoad>
                    <PublicationInfo model={model} polish={true} />
                </LazyLoad>
            </div>
        </div>
    );
}

function EnglishTab({model, tocState}) {
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
                <LazyLoad>
                    <ErrataSection model={model} />
                    <div className="publication-info">
                        <PublicationInfo model={model} url={null} />
                    </div>
                </LazyLoad>
                <LazyLoad>
                    {model.adoptions && <SavingsBlurb model={model} />}
                </LazyLoad>
            </div>
        </div>
    );
}

export default function DetailsTab({model, polish, tocState}) {
    const Child = polish ? PolishTab : EnglishTab;

    return (<Child model={model} tocState={tocState} />);
}

import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FormattedMessage} from 'react-intl';
import {Authors, PublicationInfo, ErrataSection} from '../../common/common';
import GetThisTitle from '../../common/get-this-title';
import LetUsKnow from '../../common/let-us-know/let-us-know';
import SavingsBlurb from '../../common/savings-blurb';
import Promo from '../promo';
import type {ContextValues} from '../../context';
import './details-tab.scss';

export type DetailsTabArgs = {
    model: ContextValues;
    polish: boolean;
}

function PolishTab({model}: {model: ContextValues}) {
    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h2>Przejdź do książki</h2>
                    <GetThisTitle model={model} />
                </div>
                <div className="let-us-know-region">
                    <LetUsKnow title={model.title} />
                </div>
            </div>
            <div className="main">
                <div className="loc-summary-text">
                    <h2>Podsumowanie</h2>
                    <RawHTML html={model.description} />
                </div>
                <Authors />
                <ErrataSection />
                <PublicationInfo polish={true} />
            </div>
        </div>
    );
}

function EnglishTab({model}: {model: ContextValues}) {
    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h2>
                        <FormattedMessage
                            id="getTheBook"
                            defaultMessage="Get the book"
                        />
                    </h2>
                    <GetThisTitle model={model} />
                </div>
                <div className="let-us-know-region">
                    <LetUsKnow title={model.salesforceAbbreviation} />
                </div>
            </div>
            <div className="main">
                <Promo promoteSnippet={model.promoteSnippet} />
                <div className="loc-summary-text">
                    <h2>
                        <FormattedMessage
                            id="summary"
                            defaultMessage="Summary"
                        />
                    </h2>
                    <RawHTML html={model.description} />
                </div>
                <Authors />
                <ErrataSection />
                <div className="publication-info">
                    <PublicationInfo url={null} />
                </div>
                {model.adoptions && <SavingsBlurb />}
            </div>
        </div>
    );
}

export default function DetailsTab({
    model,
    polish
}: DetailsTabArgs) {
    const Child = polish ? PolishTab : EnglishTab;

    return <Child model={model} />;
}

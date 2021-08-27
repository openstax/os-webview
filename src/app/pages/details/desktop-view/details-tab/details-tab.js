import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useDetailsContext from '~/pages/details/context';
import {Authors, PublicationInfo, ErrataSection} from '../../common/common';
import GetThisTitle from '../../common/get-this-title';
import LetUsKnow from '../../common/let-us-know/let-us-know';
import SavingsBlurb from '../../common/savings-blurb';
import './details-tab.scss';

function PolishTab({model}) {
    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h3>Przejdź do książki</h3>
                    <GetThisTitle model={model} />
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

const localizedHeading = {
    'en': 'Summary',
    'es': 'Resumen'
};

function EnglishTab({model}) {
    const {language} = useDetailsContext();

    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h3>Get the book</h3>
                    <GetThisTitle model={model} />
                </div>
                <div className="let-us-know-region">
                    <LetUsKnow title={model.salesforceAbbreviation} />
                </div>
            </div>
            <div className="main">
                <div className="loc-summary-text">
                    <h3>{localizedHeading[language]}</h3>
                    <RawHTML html={model.description} />
                </div>
                <Authors model={model} />
                <ErrataSection model={model} />
                <div className="publication-info">
                    <PublicationInfo model={model} url={null} />
                </div>
                {model.adoptions && <SavingsBlurb model={model} />}
            </div>
        </div>
    );
}

export default function DetailsTab({model, polish}) {
    const Child = polish ? PolishTab : EnglishTab;

    return (<Child model={model} />);
}

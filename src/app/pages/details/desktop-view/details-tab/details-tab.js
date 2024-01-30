import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FormattedMessage} from 'react-intl';
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
                <div className="let-us-know-region">
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

function Promo({data}) {
    if (!data) {
        console.info('**No data');
        return null;
    }

    return (
        <RawHTML html={data.content.description} />
    );
}

function EnglishTab({model}) {
    console.info('**MODEL', model);
    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h3>
                        <FormattedMessage id="getTheBook" defaultMessage="Get the book" />
                    </h3>
                    <GetThisTitle model={model} />
                </div>
                <div className="let-us-know-region">
                    <LetUsKnow title={model.salesforceAbbreviation} />
                </div>
            </div>
            <div className="main">
                <Promo data={model.promoteSnippet} />
                <div className="loc-summary-text">
                    <h3>
                        <FormattedMessage id="summary" defaultMessage="Summary" />
                    </h3>
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

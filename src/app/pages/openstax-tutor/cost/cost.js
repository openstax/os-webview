import React, {useState} from 'react';
import {LabeledSection} from '../common';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './cost.css';

function Card({title: headline, description}) {
    return (
        <div className={cn('card', {'no-border': !headline})}>
            {headline && <h2>{headline}</h2>}
            <RawHTML html={description} />
        </div>
    );
}

export default function Cost({model: {
    costHeader: headline, costDescription: description, costCards: blurbs,
    costInstitutionMessage
}}) {
    const headerLabel = 'Cost';

    return (
        <LabeledSection headerLabel={headerLabel} headline={headline}>
            <div className="cost">
                <RawHTML html={description} />
                <div className="cards">
                    {blurbs.map((blurb) => <Card {...blurb} key={blurb.description} />)}
                </div>
                <RawHTML html={costInstitutionMessage} />
            </div>
        </LabeledSection>
    );
}

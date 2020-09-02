import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

function ButtonGroup({polish, title}) {
    const PolishButtonGroup = () => (
        <div className="button-group">
            <a
                href="https://openstax.pl/pl/errata"
                className="btn secondary medium">Zgłoś poprawkę</a>
        </div>
    );

    const EnglishButtonGroup = () => (
        <div className="button-group">
            <a
                href={`/errata/form?book=${encodeURIComponent(title)}`}
                className="btn secondary medium">Suggest a correction</a>
            <a
                href={`/errata/?book=${encodeURIComponent(title)}`}
                className="btn default medium">Errata list</a>
        </div>
    );

    return polish ? <PolishButtonGroup /> : <EnglishButtonGroup />;
}

export function ErrataContents({model, polish}) {
    const title = model.bookTitle;
    const blurb = model.errataContent.content && model.errataContent.content.content;

    return (
        <React.Fragment>
            <RawHTML Tag="p" html={blurb} />
            {
                model.bookState !== 'deprecated' &&
                    <ButtonGroup polish={polish} title={title} />
            }
        </React.Fragment>
    );
}

export default function ErrataSection({model, polish=false}) {
    if (!['live', 'new_edition_available', 'deprecated'].includes(model.bookState)) {
        return null;
    }

    return (
        <div className="loc-errata">
            <h3>Errata</h3>
            <ErrataContents model={model} polish={polish} />
        </div>
    );
}

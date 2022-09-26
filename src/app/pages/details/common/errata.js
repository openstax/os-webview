import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FormattedMessage, useIntl} from 'react-intl';

function EnglishButtonGroup({title}) {
    return (
        <div className="button-group">
            <a
                href={`/errata/form?book=${encodeURIComponent(title)}`}
                className="btn secondary medium"
            >
                <FormattedMessage id="errata.suggest" defaultMessage="Suggest a correction" />
            </a>
            <a
                href={`/errata/?book=${encodeURIComponent(title)}`}
                className="btn default medium"
            >
                <FormattedMessage id="errata.list" defaultMessage="Errata list" />
            </a>
        </div>
    );
}

function ButtonGroup({polish, title}) {
    const PolishButtonGroup = () => (
        <div className="button-group">
            <a
                href="https://openstax.pl/pl/errata"
                className="btn secondary medium">Zgłoś poprawkę</a>
        </div>
    );

    return polish ? <PolishButtonGroup /> : <EnglishButtonGroup title={title} />;
}

export function ErrataContents({model, polish}) {
    const title = model.title;
    const blurb = model.errataContent;

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
    const intl = useIntl();

    if (!['live', 'new_edition_available', 'deprecated'].includes(model.bookState)) {
        return null;
    }

    if (intl.locale === 'es') {
        return null;
    }

    return (
        <div className="loc-errata">
            <h3>
                <FormattedMessage id="errata.header" defaultMessage="Errata" />
            </h3>
            <ErrataContents model={model} polish={polish} />
        </div>
    );
}

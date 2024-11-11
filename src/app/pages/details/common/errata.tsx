import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FormattedMessage, useIntl} from 'react-intl';
import useDetailsContext from '../context';
import $ from '~/helpers/$';

function EnglishButtonGroup({title}: {title: string}) {
    return (
        <div className="button-group">
            <a
                href={`/errata/form?book=${encodeURIComponent(title)}`}
                className="btn secondary medium"
            >
                <FormattedMessage
                    id="errata.suggest"
                    defaultMessage="Suggest a correction"
                />
            </a>
            <a
                href={`/errata/?book=${encodeURIComponent(title)}`}
                className="btn default medium"
            >
                <FormattedMessage
                    id="errata.list"
                    defaultMessage="Errata list"
                />
            </a>
        </div>
    );
}

function ButtonGroup({title}: {title: string}) {
    const PolishButtonGroup = () => (
        <div className="button-group">
            <a
                href="https://openstax.pl/pl/errata"
                className="btn secondary medium"
            >
                Zgłoś poprawkę
            </a>
        </div>
    );

    return $.isPolish(title) ? (
        <PolishButtonGroup />
    ) : (
        <EnglishButtonGroup title={title} />
    );
}

export function ErrataContents() {
    const {title, errataContent: blurb, bookState} = useDetailsContext();

    return (
        <React.Fragment>
            <RawHTML Tag="p" html={blurb} />
            {bookState !== 'deprecated' && <ButtonGroup title={title} />}
        </React.Fragment>
    );
}

export default function ErrataSection() {
    const intl = useIntl();
    const {bookState} = useDetailsContext();

    if (!['live', 'new_edition_available', 'deprecated'].includes(bookState)) {
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
            <ErrataContents />
        </div>
    );
}

import React from 'react';

export function ErrataContents({blurb, title, polish}) {
    const PolishButtonGroup = () =>
        <div className="button-group">
            <a href="https://openstax.pl/pl/errata"
                className="btn secondary medium">Zgłoś poprawkę</a>
        </div>;

    return (
        <React.Fragment>
            <p dangerouslySetInnerHTML={{__html: blurb}} />
            {
                polish ? <PolishButtonGroup /> :
                    <div className="button-group">
                        <a href={`/errata/form?book=${encodeURIComponent(title)}`}
                            className="btn secondary medium">Suggest a correction</a>
                        <a href={`/errata/?book=${encodeURIComponent(title)}`}
                            className="btn default medium">Errata list</a>
                    </div>
            }
        </React.Fragment>
    );
}

export default function ({bookState, blurb, title, polish}) {
    if (!['live', 'new_edition_available', 'deprecated'].includes(bookState)) {
        return null;
    }

    return (
        <div className="loc-errata">
            <h3>Errata</h3>
            <ErrataContents blurb={blurb} title={title} polish={polish} />
        </div>
    );
}

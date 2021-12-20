import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useDetailsContext from '~/pages/details/context';

const localizedTexts = {
    'en': {
        header: 'Errata',
        suggest: 'Suggest a correction',
        list: 'Errata list'
    },
    'es': {
        header: 'Fe de errata',
        suggest: 'Sugerir una corrección',
        list: 'Listado de erratas'
    }
};

function EnglishButtonGroup({title}) {
    const {language} = useDetailsContext();
    const texts = localizedTexts[language];

    return (
        <div className="button-group">
            <a
                href={`/errata/form?book=${encodeURIComponent(title)}`}
                className="btn secondary medium">{texts.suggest}</a>
            <a
                href={`/errata/?book=${encodeURIComponent(title)}`}
                className="btn default medium">{texts.list}</a>
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
    const {language} = useDetailsContext();

    if (!['live', 'new_edition_available', 'deprecated'].includes(model.bookState)) {
        return null;
    }

    if (language === 'es') {
        return null;
    }

    return (
        <div className="loc-errata">
            <h3>{localizedTexts[language].header}</h3>
            <ErrataContents model={model} polish={polish} />
        </div>
    );
}

import React from 'react';
import useLanguageContext from '~/models/language-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons/faGlobe';
import './language-selector.scss';

// This should be in the CMS
// Translates locales into language names
const languageTranslations = {
    en: {
        en: 'English',
        es: 'Spanish',
        and: 'and'
    },
    es: {
        en: 'inglés.',
        es: 'español',
        and: 'y'
    }
};

function AnotherLanguage({locale}) {
    const {language, setLanguage} = useLanguageContext();
    const tr = languageTranslations[language];

    function onClick(event) {
        event.preventDefault();
        setLanguage(locale);
    }

    return (
        <React.Fragment>
            {' '}and{' '}
            <a href={locale} onClick={onClick}>{tr[locale]}</a>
        </React.Fragment>
    );
}

export default function LanguageSelector({leadInText, otherLocales}) {
    const {language} = useLanguageContext();
    const localLanguage = languageTranslations[language][language];

    if (!otherLocales || otherLocales.length < 1) {
        return null;
    }

    return (
        <div className="language-selector">
            <FontAwesomeIcon icon={faGlobe} />
            <span>
                {leadInText[language] || leadInText.en}{' '}
                {localLanguage}
                {otherLocales.map((lo) => <AnotherLanguage key={lo} locale={lo} />)}
            </span>
        </div>
    );
}

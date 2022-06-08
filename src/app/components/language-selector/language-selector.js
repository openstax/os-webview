import React from 'react';
import useLanguageContext from '~/contexts/language';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons/faGlobe';
import './language-selector.scss';

// This should be in the CMS
// Translates locales into language names
export const languageTranslations = {
    en: {
        en: 'English',
        es: 'Spanish',
        and: 'and'
    },
    es: {
        en: 'inglés',
        es: 'español',
        and: 'y'
    }
};

export function useTranslations() {
    const {language} = useLanguageContext();

    return languageTranslations[language];
}

export function LanguageLink({locale}) {
    const {setLanguage} = useLanguageContext();
    const tr = useTranslations();
    const onClick = React.useCallback((event) => {
        event.preventDefault();
        setLanguage(locale);
    }, [locale, setLanguage]);

    return (
        <a href={locale} onClick={onClick}>{tr[locale]}</a>
    );
}

function AnotherLanguage({locale, LinkPresentation}) {
    const tr = useTranslations();

    return (
        <React.Fragment>
            {' '}{tr.and}{' '}
            <LinkPresentation locale={locale} />
        </React.Fragment>
    );
}

export function LanguageSelectorWrapper({children}) {
    return (
        <div className="language-selector">
            <FontAwesomeIcon icon={faGlobe} />
            <span>{children}</span>
        </div>
    );
}

export default function LanguageSelector({leadInText, otherLocales, LinkPresentation=LanguageLink}) {
    const {language} = useLanguageContext();
    const tr = useTranslations();
    const localLanguage = tr[language];

    if (!otherLocales || otherLocales.length < 1) {
        return null;
    }

    return (
        <LanguageSelectorWrapper>
            {leadInText[language] || leadInText.en}{' '}
            {localLanguage}
            {
                otherLocales.map(
                    (lo) => <AnotherLanguage key={lo} locale={lo} LinkPresentation={LinkPresentation} />
                )
            }
        </LanguageSelectorWrapper>
    );
}

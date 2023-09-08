import React from 'react';
import useLanguageContext from '~/contexts/language';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons/faGlobe';
import './language-selector.scss';

// You can't use a variable for id
const languageFromLocale = {
    en: () => <FormattedMessage id="en" defaultMessage="English" />,
    es: () => <FormattedMessage id="es" defaultMessage="Spanish" />
};

const NoLanguage = () => null;

export function useLanguageText(locale) {
    return React.useMemo(
        () => languageFromLocale[locale] || NoLanguage,
        [locale]
    );
}

export function LanguageLink({locale, slug}) {
    const {setLanguage} = useLanguageContext();
    const onClick = React.useCallback((event) => {
        if (!slug) {
            event.preventDefault();
        }
        setLanguage(locale);
    }, [locale, setLanguage, slug]);
    const LanguageText = useLanguageText(locale);
    const href = slug ? `/subjects/${slug}/` : locale;

    return (
        <a href={href} onClick={onClick}>
            <LanguageText />
        </a>
    );
}

function AnotherLanguage({locale, LinkPresentation}) {
    return (
        <React.Fragment>
            {' '}
            <FormattedMessage
                id="and"
                defaultMessage="and"
            />
            {' '}
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

export default function LanguageSelector({LeadIn, otherLocales, LinkPresentation=LanguageLink}) {
    const {language} = useLanguageContext();
    const LanguageText = useLanguageText(language);

    if (!otherLocales || otherLocales.length < 1) {
        return null;
    }

    return (
        <LanguageSelectorWrapper>
            <LeadIn />
            {' '}
            <LanguageText />
            {
                otherLocales.map(
                    (lo) => <AnotherLanguage key={lo} locale={lo} LinkPresentation={LinkPresentation} />
                )
            }
        </LanguageSelectorWrapper>
    );
}

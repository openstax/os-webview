import React from 'react';
import useLanguageContext from '~/contexts/language';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons/faGlobe';
import './language-selector.scss';

// You can't use a variable for id
const languageFromLocale = {
    en: () => <FormattedMessage id="en" defaultMessage="English" />,
    es: () => <FormattedMessage id="es" defaultMessage="Spanish" />,
    pl: () => <FormattedMessage id="pl" defaultMessage="Polish" />
};

const polishSite = 'https://openstax.pl/podreczniki';

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
        event.preventDefault();
        setLanguage(locale);
    }, [locale, setLanguage]);
    const LanguageText = useLanguageText(locale);
    const href = slug ? `/subjects/${slug}/` : locale;

    // Magic: handle Polish specially
    if (locale === 'pl') {
        return (
            // eslint-disable-next-line react/jsx-no-target-blank
            <a href={polishSite} target="_blank">
                <LanguageText />
            </a>
        );
    }

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

export default function LanguageSelector({
    LeadIn, otherLocales=[], LinkPresentation=LanguageLink, addPolish=false
}) {
    const {language} = useLanguageContext();
    const LanguageText = useLanguageText(language);

    if (addPolish) {
        otherLocales.push('pl');
    }

    if (otherLocales.length < 1) {
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

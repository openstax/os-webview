import React from 'react';
import useLanguageContext from '~/contexts/language';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons/faGlobe';
import './language-selector.scss';

const polishSite = 'https://openstax.pl/podreczniki';

export function LanguageLink({locale, slug}) {
    const {setLanguage} = useLanguageContext();
    const onClick = React.useCallback((event) => {
        event.preventDefault();
        setLanguage(locale);
    }, [locale, setLanguage]);
    const href = slug ? `/subjects/${slug}/` : locale;
    const props = locale === 'pl' ? {href: polishSite, target: '_blank'} : {href, onClick};

    return (<a {...props}><LanguageText locale={locale} /></a>);
}

// Provide a fallback so ancient browsers don't outright fail
function LanguageText({locale}) {
    if (Intl.DisplayNames) {
        return (<LanguageTextUsingIntl locale={locale} />);
    }
    return locale;
}

function LanguageTextUsingIntl({locale}) {
    const {language} = useLanguageContext();
    const languageName = React.useMemo(
        () => new Intl.DisplayNames([language], {type: 'language'}),
        [language]
    );

    return (
        <React.Fragment>
            {languageName.of(locale)}
        </React.Fragment>
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
    if (addPolish) {
        otherLocales.push('pl');
    }
    const {language} = useLanguageContext();

    if (otherLocales.length < 1) {
        return null;
    }

    return (
        <LanguageSelectorWrapper>
            <LeadIn />
            {' '}
            <LanguageText locale={language} />
            {
                otherLocales.map(
                    (lo) => <AnotherLanguage key={lo} locale={lo} LinkPresentation={LinkPresentation} />
                )
            }
        </LanguageSelectorWrapper>
    );
}

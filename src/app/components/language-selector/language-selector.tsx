import React from 'react';
import useLanguageContext from '~/contexts/language';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons/faGlobe';
import './language-selector.scss';

const polishSite = 'https://openstax.pl/podreczniki';

type PLocaleEntry = {
    locale: string;
    slug?: string;
};

export type LocaleEntry = Required<PLocaleEntry>

export function LanguageLink({locale, slug}: PLocaleEntry) {
    const {setLanguage} = useLanguageContext();
    const onClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setLanguage(locale);
    }, [locale, setLanguage]);
    const href = slug ? `/subjects/${slug}/` : locale;
    const props = locale === 'pl' ? {href: polishSite, target: '_blank'} : {href, onClick};

    return (<a {...props}><LanguageText locale={locale} /></a>);
}

export function LanguageText({locale}: {locale: string}) {
    const {language} = useLanguageContext();
    const text = React.useMemo(
        () => (new Intl.DisplayNames([language], {type: 'language'})).of(locale),
        [language, locale]
    );

    return text;
}

type LinkPresentationType = ({locale}: PLocaleEntry) => React.JSX.Element | null;

function AnotherLanguage({locale, LinkPresentation, position, listLength}: {
    locale: string;
    LinkPresentation: LinkPresentationType;
    position: number;
    listLength: number;
}) {
    return (
        <React.Fragment>
            {listLength > 1 ? ', ' : ' '}
            {position === listLength ?
                <FormattedMessage
                    id="and"
                    defaultMessage="and"
                /> : null}
            {' '}
            <LinkPresentation locale={locale} />
        </React.Fragment>
    );
}

export function LanguageSelectorWrapper({children}: React.PropsWithChildren<Record<never, never>>) {
    return (
        <div className="language-selector">
            <FontAwesomeIcon icon={faGlobe} />
            <span>{children}</span>
        </div>
    );
}

export default function LanguageSelector({
    LeadIn, otherLocales, LinkPresentation=LanguageLink, addPolish=false
}: {
    LeadIn: () => React.JSX.Element;
    otherLocales: string[];
    LinkPresentation?: LinkPresentationType;
    addPolish?: boolean;
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
                    (lo, i) => <AnotherLanguage
                        key={lo} locale={lo} LinkPresentation={LinkPresentation}
                        position={i+1} listLength={otherLocales.length}
                    />
                )
            }
        </LanguageSelectorWrapper>
    );
}

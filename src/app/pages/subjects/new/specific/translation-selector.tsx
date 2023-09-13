import React from 'react';
import LanguageSelector, {
    LanguageLink,
    LocaleEntry
} from '~/components/language-selector/language-selector';
import useLanguageContext from '~/contexts/language';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

type Translations = Array<LocaleEntry>;

export default function TranslationSelector({
    translations = []
}: {
    translations: Translations;
}) {
    const otherLocales = React.useMemo(
        () => (translations.length ? translations.map((t) => t.locale) : []),
        [translations]
    );
    const translationSlug = React.useCallback(
        (locale: string) => translations.find((t) => t.locale === locale) ?? {},
        [translations]
    );
    const LinkPresentation = React.useCallback(
        ({locale}: {locale: string}) => {
            const {slug} = translationSlug(locale) as LocaleEntry;

            if (!slug) {
                return null;
            }

            return <LanguageLink locale={locale} slug={slug} />;
        },
        [translationSlug]
    );

    useNavigateOnLanguageChange(translationSlug);

    return (
        <section className='language-selector-section'>
            <div className='content'>
                <LanguageSelector
                    LeadIn={LeadIn}
                    otherLocales={otherLocales}
                    LinkPresentation={LinkPresentation}
                />
            </div>
        </section>
    );
}

function LeadIn() {
    return (
        <FormattedMessage
            id='pageAvailableIn'
            defaultMessage='This page is available in'
        />
    );
}

function useNavigateOnLanguageChange(
    translationSlug: (locale: string) => Partial<LocaleEntry>
) {
    const {language} = useLanguageContext();
    const navigate = useNavigate();

    React.useEffect(() => {
        const slug = translationSlug(language).slug;

        if (slug) {
            navigate(`/subjects/${slug.replace('-books', '')}`, {
                replace: true
            });
        }
    }, [language, translationSlug, navigate]);
}

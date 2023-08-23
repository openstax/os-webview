import React from 'react';
import useDetailsContext, {LocaleType, TranslationType} from '../context';
import {FormattedMessage} from 'react-intl';
import LanguageSelector, {
    useLanguageText
} from '~/components/language-selector/language-selector';

export default function LinksToTranslations() {
    const {
        translations: [translations = []]
    } = useDetailsContext();
    const LeadIn = React.useCallback(
        () => (
            <FormattedMessage
                id='bookAvailableIn'
                defaultMessage='This book available in'
            />
        ),
        []
    );
    const LinkPresentation = React.useCallback(
        ({locale}: LocaleType) => (
            <AnotherLanguage locale={locale} translations={translations} />
        ),
        [translations]
    );

    if (translations.length === 0) {
        return null;
    }

    return (
        <LanguageSelector
            LeadIn={LeadIn}
            otherLocales={translations.map((t) => t.locale)}
            LinkPresentation={LinkPresentation}
        />
    );
}

function AnotherLanguage({
    locale,
    translations
}: LocaleType & {translations: TranslationType}) {
    const LanguageText = useLanguageText(locale);
    const translation = React.useMemo(
        () => translations.find((t) => t.locale === locale),
        [translations, locale]
    );

    if (!translation) {
        return null;
    }

    // translation is guaranteed to have a valid value, because the locale
    // is pulled from translations
    return (
        <a href={`/details/books/${translation.slug}`}>
            <LanguageText />
        </a>
    );
}

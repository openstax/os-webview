import React from 'react';
import LanguageSelector, {useTranslations} from '~/components/language-selector/language-selector';

// Rather than changing the Language setting, offer links to the page with the
// desired translation, because the URL overrides the language on the specific
// subject page
const leadInText = {
    en: 'This page is available in',
    es: 'Esta página está disponible en'
};

export default function TranslationSelector({translations}) {
    const tr = useTranslations();
    const TranslationLink = React.useCallback(
        ({locale}) => {
            const {slug} = translations.find((t) => t.locale === locale) || {};

            if (!slug) {
                return null;
            }

            return (
                <a href={`/subjects/${slug}/`}>{tr[locale]}</a>
            );
        },
        [translations, tr]
    );
    const otherLocales = translations.length ?
        translations.map((t) => t.locale) :
        []
    ;

    return (
        <section className="language-selector-section">
            <div className="content">
                <LanguageSelector
                    leadInText={leadInText} otherLocales={otherLocales}
                    LinkPresentation={TranslationLink}
                />
            </div>
        </section>
    );
}

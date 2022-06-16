import React from 'react';
import LanguageSelector, {useLanguageText} from '~/components/language-selector/language-selector';
import {FormattedMessage} from 'react-intl';

function TranslationLink({locale, slug}) {
    const LanguageText = useLanguageText(locale);

    return (
        <a href={`/subjects/${slug}/`}>
            <LanguageText />
        </a>
    );
}

function LeadIn() {
    return (
        <FormattedMessage id="pageAvailableIn" defaultMessage="This page is available in" />
    );
}

export default function TranslationSelector({translations}) {
    const otherLocales = React.useMemo(
        () => translations.length ? translations.map((t) => t.locale) : [],
        [translations]
    );
    const LinkPresentation = React.useCallback(
        ({locale}) => {
            const {slug} = translations.find((t) => t.locale === locale) || {};

            if (!slug) {
                return null;
            }

            return (
                <TranslationLink locale={locale} slug={slug} />
            );
        },
        [translations]
    );

    return (
        <section className="language-selector-section">
            <div className="content">
                <LanguageSelector
                    LeadIn={LeadIn} otherLocales={otherLocales}
                    LinkPresentation={LinkPresentation}
                />
            </div>
        </section>
    );
}

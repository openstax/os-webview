import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/components/jsx-helpers/page-loader';
import useLanguageContext from '~/models/language-context';

const preserveWrapping = true;

function useContextValue() {
    const [slug, setSlug] = React.useState('subjects');
    const data = usePageData(`pages/${slug}`, preserveWrapping);
    const {language} = useLanguageContext();

    React.useEffect(() => {
        if (!data || !data.translations) {
            return;
        }
        const translations = data.translations[0].value;
        const thisTranslation = translations.find((t) => t.locale === language);

        if (thisTranslation) {
            setSlug(thisTranslation.slug);
        }
    }, [data, language]);

    if (data) {
        data.books = data.books.filter((b) => b.bookState !== 'retired');
    }

    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SubjectsContextProvider
};

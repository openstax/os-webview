import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/components/jsx-helpers/page-loader';
import useLanguageContext from '~/contexts/language';

const preserveWrapping = true;
const icons = [
    '/images/subjects/author-icon.svg',
    '/images/subjects/scope-icon.svg',
    '/images/subjects/review-icon.svg'
];

function aboutBlurbs(model) {
    const textData = Reflect.ownKeys(model)
        .filter((k) => (/^devStandard\d/).test(k))
        .reduce((a, b) => {
            const [_, num, textId] = b.match(/(\d+)(\w+)/);
            const index = num - 1;

            a[index] = a[index] || {};
            a[index][textId.toLowerCase()] = model[b];
            a[index].iconUrl = icons[index];
            return a;
        }, []);

    return textData;
}

function useContextValue() {
    const [slug, setSlug] = React.useState('new-subjects');
    const data = usePageData(`pages/${slug}`, preserveWrapping);
    const {language} = useLanguageContext();

    React.useEffect(() => {
        if (!data || !data.translations || !data.translations.length) {
            return;
        }
        const translations = data.translations[0].value;
        const thisTranslation = translations.find((t) => t.locale === language);

        if (thisTranslation) {
            setSlug(thisTranslation.slug);
        }
    }, [data, language]);

    if (data?.books) {
        data.books = data.books.filter((b) => b.bookState !== 'retired');
    }

    if (data) {
        data.aboutBlurbs = aboutBlurbs(data);
    }

    console.info('RETURNING', data);
    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SubjectsContextProvider
};

import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useLanguageContext from '~/contexts/language';
import {useIntl} from 'react-intl';
import cmsFetch from '~/helpers/cms-fetch';

type InputItem = {
    name: string;
    seo_title: string;
    subject_icon: string;
    subject_color: string;
};

type Category = {
    value: string;
    cms: string;
    html: string;
    title: string;
    icon: string;
    color: string;
};

function dataToEntry(item: InputItem): Category {
    const name = item.name || '';
    const value = name.toLowerCase().replace(' ', '-').normalize('NFD').replace(/\p{Diacritic}/gu, '');

    return {
        value,
        cms: name,
        html: name,
        title: item.seo_title,
        icon: item.subject_icon,
        color: item.subject_color
    };
}

export type ContextValues = Array<Category>;

function useContextValue(): ContextValues {
    const {language} = useLanguageContext();

    return useSubjectCategoriesForLocale(language);
}

function useSubjectCategoriesForLocale(locale: string): ContextValues {
    const [value, setValue] = useState<ContextValues>([]);
    const intl = useIntl();

    useEffect(() => {
        const viewAllEntry = {value: 'view-all', cms: '', html: intl.formatMessage({id: 'viewAll'})};

        // Empty the language-incompatible entries right away
        setValue([]);
        cmsFetch(`snippets/subjects?format=json&locale=${locale}`)
            .then((data) => data.map(dataToEntry))
            .then((data) => [viewAllEntry, ...data])
            .then(setValue);
    }, [locale, intl]);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SubjectCategoryContextProvider,
    useSubjectCategoriesForLocale
};

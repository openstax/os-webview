import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useLanguageContext from '~/contexts/language';
import cmsFetch from '~/models/cmsFetch';

function dataToEntry(item) {
    const name = item.name || '';
    const value = name.toLowerCase().replace(' ', '-');

    return {
        value,
        cms: name,
        html: name,
        title: item.seo_title,
        icon: item.subject_icon,
        color: item.subject_color
    };
}

const viewAllHtmls = {
    'en': 'View All',
    'es': 'Ver Todo'
};

function useContextValue() {
    const {language} = useLanguageContext();
    const [value, setValue] = useState([]);

    useEffect(() => {
        const viewAllEntry = {value: 'view-all', cms: '', html: viewAllHtmls[language]};

        cmsFetch(`snippets/subjects?format=json&locale=${language}`)
            .then((data) => data.map(dataToEntry))
            .then((data) => [viewAllEntry, ...data])
            .then(setValue);
    }, [language]);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SubjectCategoryContextProvider
};

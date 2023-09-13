import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useLanguageContext from '~/contexts/language';
import {useIntl} from 'react-intl';
import cmsFetch from '~/helpers/cms-fetch';

function dataToEntry(item) {
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

function useContextValue() {
    const {language} = useLanguageContext();
    const [value, setValue] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const viewAllEntry = {value: 'view-all', cms: '', html: intl.formatMessage({id: 'viewAll'})};

        // Empty the language-incompatible entries right away
        setValue([]);
        cmsFetch(`snippets/subjects?format=json&locale=${language}`)
            .then((data) => data.map(dataToEntry))
            .then((data) => [viewAllEntry, ...data])
            .then(setValue);
    }, [language, intl]);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SubjectCategoryContextProvider
};

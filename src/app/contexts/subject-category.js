import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useLanguageContext from '~/contexts/language';
import cmsFetch from '~/models/cmsFetch';

// TODO: These need to be in the CMS
const subjectIcons = {
    math: '/images/subjects/subj-icon-calculator.svg',
    science: '/images/subjects/subj-icon-science.svg',
    business: '/images/subjects/subj-icon-business.svg',
    'college-success': '/images/subjects/subj-icon-success.svg',
    humanities: '/images/subjects/subj-icon-humanities.svg',
    'social-sciences': '/images/subjects/subj-icon-social-sciences.svg',
    'high-school': '/images/subjects/subj-icon-high-school.svg'
};

const colors = {
    math: 'red',
    science: 'deep-green',
    business: 'blue',
    'college-success': 'orange',
    humanities: 'light-blue',
    'social-sciences': 'gold',
    'high-school': 'green'
};

function dataToEntry(item) {
    const name = item.name || '';
    const value = name.toLowerCase().replace(' ', '-');

    return {
        value,
        cms: name,
        html: name,
        title: item.seo_title,
        icon: subjectIcons[value],
        color: colors[value]
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

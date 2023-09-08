import React from 'react';
import usePageData from '~/helpers/use-page-data';
import buildContext from '~/components/jsx-helpers/build-context';
import {setPageTitleAndDescriptionFromBookData} from '~/helpers/use-document-head';

const preserveWrapping = false;

function useContextValue(slug) {
    const data = usePageData(`pages/${slug}-books?type=pages.Subject`, preserveWrapping);
    const categories = React.useMemo(
        () => {
            if (!data) {
                return [];
            }

            const {subjects, title} = data;

            if (subjects && title) {
                return Object.entries(subjects[title].categories);
            }
            console.warn('Specific subjects and title need to be defined');
            return [];
        },
        [data]
    );

    React.useEffect(
        () => {
            if (data) {
                setPageTitleAndDescriptionFromBookData(data);
            }
        },
        [data]
    );

    return {...data, categories};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};

import {useEffect} from 'react';
import usePageData from '~/components/jsx-helpers/page-loader';
import buildContext from '~/components/jsx-helpers/build-context';
import $ from '~/helpers/$';

const preserveWrapping = false;

function useContextValue(slug) {
    const data = usePageData(`pages/${slug}`, preserveWrapping);

    useEffect(
        () => {
            if (data) {
                $.setPageTitleAndDescriptionFromBookData(data);
            }
        },
        [data]
    );

    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};

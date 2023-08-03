import React, {ReactElement} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useData from '~/helpers/use-data';
import {Collection} from '~/components/explore-by-collection/types';
import {Category} from '~/components/explore-by-subject/types';
import {PageData} from './types';

function useEnglishSubjects(): Category[] {
    return useData(
        {
            slug: 'snippets/subjects?format=json&locale=en',
            resolveTo: 'json',
            camelCase: true
        },
        []
    );
}

function useCollections(): Collection[] {
    return useData(
        {
            slug: 'snippets/webinarcollection?format=json',
            resolveTo: 'json',
            camelCase: true
        },
        []
    );
}

function useContextValue() {
    const subjects = useEnglishSubjects();
    const collections = useCollections();
    const searchFor = React.useCallback(
        (term: string) => console.info(`Search for ${term} not implemented`),
        []
    );
    const pageData: PageData = useData(
        {
            slug: 'pages/webinars',
            resolveTo: 'json',
            camelCase: true
        },
        {}
    );

    return {subjects, searchFor, pageData, collections};
}

// Until build-context is converted to TS
type Context = {
    useContext: () => ReturnType<typeof useContextValue>;
    ContextProvider: ReturnType<typeof buildContext>['ContextProvider'];
};
const {useContext, ContextProvider} = buildContext({
    useContextValue
}) as Context;

function WebinarContextProvider({
    children
}: {
    children: ReactElement | ReactElement[];
}) {
    return <ContextProvider>{children}</ContextProvider>;
}

export {useContext as default, WebinarContextProvider};

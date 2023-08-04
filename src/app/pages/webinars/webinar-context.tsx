import React, {ReactElement} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useData from '~/helpers/use-data';
import {Collection} from '~/components/explore-by-collection/types';
import {Category} from '~/components/explore-by-subject/types';
import {PageData, Webinar} from './types';

function useEnglishSubjects() {
    return useData<Category[]>(
        {
            slug: 'snippets/subjects?format=json&locale=en',
            resolveTo: 'json',
            camelCase: true
        },
        []
    );
}

function useCollections() {
    return useData<Collection[]>(
        {
            slug: 'snippets/webinarcollection?format=json',
            resolveTo: 'json',
            camelCase: true
        },
        []
    );
}

function useWebinars() {
    return useData<Webinar[]>(
        {
            slug: 'webinars/?format=json',
            resolveTo: 'json',
            camelCase: true,
            postProcess: (w) => {
                w.start = new Date(w.start);
                w.end = new Date(w.end);
                return w;
            }
        },
        []
    );
}

// Sort helper for webinars
function byDate(a: Webinar, b: Webinar) {
    return a.start.valueOf() - b.start.valueOf();
}

function useContextValue() {
    const subjects = useEnglishSubjects();
    const collections = useCollections();
    const webinars = useWebinars();
    const searchFor = React.useCallback(
        (term: string) => console.info(`Search for ${term} not implemented`),
        []
    );
    const pageData = useData<PageData>(
        {
            slug: 'pages/webinars',
            resolveTo: 'json',
            camelCase: true
        },
        {}
    );
    const latestWebinars = React.useMemo(
        () => webinars.sort(byDate),
        [webinars]
    );

    return {subjects, searchFor, pageData, collections, latestWebinars};
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

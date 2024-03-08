import {useState, useCallback} from 'react';
import {useLocation} from 'react-router-dom';
import buildContext from '~/components/jsx-helpers/build-context';

export function useCurrentSearchParameter() {
    const {search} = useLocation();

    return new window.URLSearchParams(search).get('q') ?? '';
}

export type SearchFunction = (term: string) => unknown;

function useContextValue({searchFor}: {searchFor: SearchFunction}) {
    const [searchString, setSearchString] = useState(
        useCurrentSearchParameter()
    );
    const doSearch = useCallback(
        () => searchFor(searchString),
        [searchFor, searchString]
    );

    return {searchString, setSearchString, doSearch};
}

type Returns = {
    useContext: () => ReturnType<typeof useContextValue>;
    ContextProvider: ({ children, contextValueParameters }: {
        children: unknown;
        contextValueParameters?: Parameters<typeof useContextValue>[0];
    }) => React.JSX.Element | null;
}

const {useContext, ContextProvider} = buildContext({useContextValue}) as Returns;

export {useContext as default, ContextProvider as SearchContextProvider};

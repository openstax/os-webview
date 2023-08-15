import {useState, useCallback} from 'react';
import {useLocation} from 'react-router-dom';
import buildContext from '~/components/jsx-helpers/build-context';

export function useCurrentSearchParameter() {
    const {search} = useLocation();

    return new window.URLSearchParams(search).get('q') ?? '';
}

type SearchFunction = (term: string) => Array<unknown>;

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

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as SearchContextProvider};

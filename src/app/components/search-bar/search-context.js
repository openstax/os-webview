import {useState, useCallback} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({searchFor}) {
    const [searchString, setSearchString] = useState(new window.URLSearchParams(window.location.search).get('q') || '');
    const doSearch = useCallback(
        () => searchFor(searchString),
        [searchFor, searchString]
    );

    return {searchString, setSearchString, doSearch};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SearchContextProvider
};

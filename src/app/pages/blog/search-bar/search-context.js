import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useBlogContext from '../blog-context';

function useContextValue() {
    const {setPath} = useBlogContext();
    const [searchString, setSearchString] = useState(new window.URLSearchParams(window.location.search).get('q'));

    function doSearch() {
        setPath(`/blog/?q=${searchString}`);
    }

    return {searchString, setSearchString, doSearch};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SearchContextProvider
};
